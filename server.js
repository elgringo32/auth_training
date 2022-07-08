const express = require('express')
const app = express()
const PORT = 8000
const connectDB = require('./db')

//Connect DB via db.js
connectDB()

//setup server on port
const server = app.listen(PORT, () => console.log(`server connected to port ${PORT}`))
