const jwt = require('jsonwebtoken')
const asyncHandler = require('./asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/User')




exports.protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } 
  // else if (req.cookies.token) {
  //   token = req.cookies.token
  // }

  if(!token) {
    return next(new ErrorResponse('Not authorized to access this route', 400))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) {
      return next(new ErrorResponse('Can not find user with that id', 400))
    }
    req.user = user
    next()
  } catch (error) {
    console.log(error)
  }
})



exports.authorize = (...roles) => {
  return (req, res, next) => {
    let check = false
    roles.forEach(role => {
      if(role === req.user.role) {
        check = true
      }
    }  )
    if (check === false) {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized`, 403))
    }
    next()
  }
}