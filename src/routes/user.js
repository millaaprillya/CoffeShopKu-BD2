const router = require('express').Router()
const { registerUser, loginUser } = require('../controler/user')

router.post('/register', registerUser)
router.post('/login', loginUser)

module.exports = router