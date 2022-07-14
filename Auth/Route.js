const express = require('express')
const router = express.Router()
const {register, login, getUsers, update, deleteUser} = require('./Auth')
const {adminAuth} = require('../middleware/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/getUsers').get(adminAuth, getUsers)
router.route('/update').put(adminAuth, update)
router.route('/deleteUser').delete(adminAuth, deleteUser)

module.exports = router