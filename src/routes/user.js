const router = require('express').Router()
const { authorizationAdmin } = require('../middleware/auth')
const {
  registerUser,
  loginUser,
  getUser,
  getUserById,
  forgotPassword,
  resetPassword,
  patchUser
} = require('../controler/user')
const uploadImage = require('../middleware/multer_user')

router.get('/getUser', authorizationAdmin, getUser)
router.get('/:id', getUserById)
router.patch('/:id', uploadImage, patchUser)
router.post('/register', uploadImage, registerUser)
router.post('/login', loginUser)
router.post('/forgot', forgotPassword)
router.patch('/resetPassword/email', resetPassword)
module.exports = router
