const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

exports.adminAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({message:'Not authorized - Error decoding'})
            } else {
                if (decodedToken.role !== 'Admin') {
                    return res.status(401).json({message:'Not authorized - need admin role'})
                } else {
                    next()
                }
            }
        
        })
    } else {
        return res.status(401).json({
            message: "Not authorized"
        })
    }
}


exports.basicAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                return res.status(401).json({message:'Not authorized - Error decoding'})
            } else {
                if (decodedToken.role !== 'Basic') {
                    return res.status(401).json({message:'Not authorized - need basic role'})
                } else {
                    next()
                }
            }
        
        })
    } else {
        return res.status(401).json({
            message: "Not authorized"
        })
    }
}