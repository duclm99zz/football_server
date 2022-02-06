const User = require('../models/User')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')


// @desc  Register user
// @route GET api/v1/auth/register
// @access Public
exports.register = asyncHandler (async (req, res, next) => {
  const { name, email, password, role } = req.body
  
  const user = await User.create({name, email, password, role})
  if (!user) {
    return next(new ErrorResponse('Register failed!',400))
  }
  
  sendTokenResponse(user, 200, res)
})


// @desc  Login
// @route GET api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body

  if (!email || !password) {
    return next(new ErrorResponse('Please provide correct email and password', 400))
  }

  const user = await User.findOne({email}).select('+password')

  if (!user ) {
    return next(new ErrorResponse('User not found with that credentials', 400))
  }
  const isMatch = await user.matchPassword(password)

  if(!isMatch) {
    return next(new ErrorResponse('Invalid password', 400))
  }

  sendTokenResponse(user, 200, res)

})


const sendTokenResponse =  (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 69 * 1000),
    httpOnly: true
  }
  if(process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({success: true, token})
}

/// @desc Get current logged in user
// @route PUT api/v1/auth/resetpassword/:resettoken
// @access Public

exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)
  if (!user) {
    return next(new ErrorResponse('Get information user failed', 400))
  }
  res.status(200).json({
    success: true, data: user
  })
})


// @desc Reset password
// @route POST api/v1/auth/me
// @access Private
exports.resetPassword = asyncHandler (async (req, res, next) => {
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now()}
  })

  if(!user) {
    return next (new ErrorResponse('Invalid Token', 401))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined
  await user.save()

  sendTokenResponse(user, 200, res)

})

// @desc Forgot password
// @route POST api/v1/auth/forgotpassword
// @access public
exports.forgotPassword = asyncHandler (async (req, res, next) => {
  const user = await User.findOne({email: req.body.email})

  if (!user) {
    return next(new ErrorResponse('There is no user with the email'))
  }

  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false})

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`
  const message = `You are receiving this email because you has requested the reset of a password.Put \n\n ${resetUrl}`
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    })
    res.status(200).json({ success: true, data: 'Email sent' })
  } catch (error) {
    console.error(error)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false})
    return next(new ErrorResponse('Email could not be sent', 500))
  }
  res.status(200).json({
    success: true,
    data: user
  })
})




// @desc Update users details
// @route PUT api/v1/auth/updatedetails
// @access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  }
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate,{
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: user
  })
})




// @desc Update password
// @route PUT api/v1/auth/updatepassword
// @access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  if(!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401))
  }

  user.password = req.body.newPassword
  await user.save()

  sendTokenResponse(user, 200, res)
})



// @desc Log user out/ clear cookie
// @route GET api/v1/auth/logout
// @access Private

exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    data: {}
  })
})
