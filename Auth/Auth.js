const User = require('../model/User')
const bcrypt = require('bcryptjs')

//TODO
// -add username check
exports.register = async (req, res, next) => {
    const {username, password} = req.body
    if (password.length < 6) {
        return res.status(400).json({message:"password must be 6 or greater characters"})
    }
    try {
        bcrypt.hash(password,10)
        .then(async (hash) => 
        await User.create({
            username,
            password: hash,
        })
        .then(user => 
            res.status(200).json({
                message: "User successfully created",
                user,
            })
        ))
    } catch (err) {
        res.status(401).json({
            message:"User not created do to error",
            error: err.message,
        })
    }

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
                    res.status(200).json({
                        message: "login succesful",
                        user,
                    })
                } else {
                    return res.status(401).json({message:"password is not valid"})
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

exports.update = async (req, res, next) => {
    const {role, id} = req.body
    if (role && id) {
        if (role === 'admin') {
            await User.findById(id)
            .then((user) => {
                if (user.role != 'admin') {
                    user.role = role
                    user.save((err) => {
                        if (err) {
                            res.status(400).json({
                                message: err.message
                            })
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
                    message: err.message
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