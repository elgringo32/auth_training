const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtSecret = process.env.JWT_SECRET

//TODO
// -add username check
exports.register = async (req, res, next) => {
    const {username, password} = req.body
    if (password.length < 6) {
        return res.status(400).json({message:"password must be 6 or greater characters"})
    }
        bcrypt.hash(password,10)
        .then(async (hash) => 
        await User.create({
            username,
            password: hash,
        })
        .then((user) => {
            const maxAge = 3 * 60 *60
            const token = jwt.sign(
                {
                    id: user._id,
                    username,
                    role: user.role
                },
                jwtSecret,
                {
                    expiresIn: maxAge
                }
            )
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: maxAge * 1000,
            })    
            res.status(200).json({
                message: "User successfully created",
                user,
            })
        })) 
        .catch((err) => 
            res.status(401).json({
            message:"User not created do to error",
            error: err.message,
            })
        )
}

exports.login = async (req, res, next) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({message:"username or password is missing"})
    }
    try {
        const user = await User.findOne({username})
        if (!user) {
            return res.status(401).json({message:"username or password are not valid"})
        } else {
            bcrypt.compare(password, user.password)
            .then((result) => {
                if (result) {
                    const maxAge = 3 * 60 *60
                    const token = jwt.sign(
                {
                    id: user._id,
                    username,
                    role: user.role
                },
                jwtSecret,
                {
                    expiresIn: maxAge
                }
                )
                res.cookie('jwt', token, {
                    httpOnly: true,
                    maxAge: maxAge * 1000,
                })
                res.locals.authedUser = 1    
                res.status(200).json({
                    message: "User successfully logged in",
                    user,
                })
                } else {
                    return res.status(400).json({message:"login failed"})
                }
            })
        }   
    }
    catch (err) {
        res.status(400).json({
                message: "Unable to connect to server",
                error: err.message,
            })
    }
}

exports.getUsers = async (req, res, next) => {
    await User.find({})
      .then((users) => {
        const userFunction = users.map((user) => {
          const container = {};
          container.username = user.username;
          container.role = user.role;
          container.id = user._id;
  
          return container;
        });
        res.status(200).json({ user: userFunction });
      })
      .catch((err) =>
        res.status(401).json({ message: "Not successful", error: err.message })
      );
  };
  

exports.update = async (req, res, next) => {
    const {role, id} = req.body
    console.log(req.cookie)
    if (role && id) {
        if (role === 'Admin') {
            await User.findById(id)
            .then((user) => {
                if (user.role != 'Admin') {
                    user.role = role
                    user.save((err) => {
                        if (err) {
                            res.status(400).json({
                                message: err.message
                            })
                            console.log(err)
                            process.exit(1)
                        } else {
                            res.status(201).json({
                                message: "update successful",
                                user,
                            })
                        }
                    })
                } else {
                    res.status(400).json({
                        message: "User is already an admin",
                        user,
                })
                }
            })
            .catch((err) => {
                res.status(400).json({
                    message: err.message,
                })
                
            })
        } else {
            res.status(400).json({
                message: "role is not admin",
            })
        }
    } else {
        res.status(400).json({
            message: "role or id missing",
    })
    }
}

exports.deleteUser = async (req, res, next) => {
    const {id} = req.body
    await User.findById(id)
        .then(user => user.remove())
        .then(user => {
            res.status(201).json({
                message: "user has been removed",
                user
            })
        })
        .catch(err => {
            res.status(400).json({
                message: "something went wrong"
            })
        }
            
        )
} 


