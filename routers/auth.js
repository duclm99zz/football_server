const express = require('express')
const {protect} = require('../middleware/auth')
const router = express.Router()
const { 
  register, 
  login, 
  getMe, 
  forgotPassword, 
  resetPassword, 
  updateDetails,
  updatePassword,
  logout
} = require('../controllers/auth')

router.post('/register', register)

router.post('/login', login)
router.get('/logout', logout)
router.get('/me', protect, getMe)
router.put('/updatedetails', protect, updateDetails)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)
router.put('/updatepassword', protect, updatePassword)
module.exports = router