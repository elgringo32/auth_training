const express = require('express')
const app = express()
const PORT = 8000
const connectDB = require('./db')

//Connect DB via db.js
connectDB()

app.use(express.json())
app.use('/api/Auth', require('./Auth/Route'))

//setup server on port
const server = app.listen(PORT, () => console.log(`server connected to port ${PORT}`))

//log server connection error and close server
process.on('unhandledRejection', err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
})