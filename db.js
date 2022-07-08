const Mongoose = require('mongoose')
require('dotenv').config()
const remoteDB = process.env.DB_STRING
const connectDB = () => {
    Mongoose.connect(remoteDB)
    .then(client => {
        console.log("Connected to DB")
    })
}

module.exports = connectDB