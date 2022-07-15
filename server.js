const express = require('express')
const app = express()
const PORT = 8000
const connectDB = require('./db')
const cookieParser = require('cookie-parser')
const {adminAuth, basicAuth} = require('./middleware/auth')
//Connect DB via db.js
connectDB()

app.set('view engine', 'ejs')

app.use(express.json())
app.use(cookieParser())

app.use('/api/Auth', require('./Auth/Route'))

app.get('/', (req, res) => res.render('home'))
app.get('/register', (req, res) => res.render('register'))
app.get('/login', (req, res) => res.render('login'))
app.get('/logout', (req, res) => {
    res.cookie('jwt','',{maxAge: '1'})
    res.redirect('/')
})
app.get('/admin', adminAuth, (req, res) => res.render('admin'))
app.get('/basic', basicAuth, (req, res) => res.render('basic'))


//setup server on port
const server = app.listen(PORT, () => console.log(`View on http://localhost:${PORT}`))

//log server connection error and close server
process.on('unhandledRejection', err => {
    console.log(`An error occurred: ${err.message}`)
    server.close(() => process.exit(1))
})