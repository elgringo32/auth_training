const express = require('express')
const app = express()
const PORT = 8000
const connectDB = require('./db')
const cookieParser = require('cookie-parser')
const {adminAuth, basicAuth} = require('./middleware/auth')
//Connect DB via db.js
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use('/api/Auth', require('./Auth/Route'))

app.get('/admin', adminAuth, (req, res) => res.send('Admin Route'))
app.get('/basic', basicAuth, (req, res) => res.send('Basic Route'))


//setup server on port
const server = app.listen(PORT, () => console.log(`server connected to port ${PORT}`))

//log server connection error and close server
process.on('unhandledRejection', err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
})