const User = require('../models/User')
const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')



// @desc Get all users
// @route GET api/v1/auth/users
// @access Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})



// @desc Get a single user
// @route GET api/v1/auth/users/:id
// @access Public
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if(!user) {
    return next(new ErrorResponse(`User with id ${req.params.id} not found`, 404))
  }

  res.status(200).json({success: true, message: 'Get single user information successfully', data: user})
})


// @desc Create a new user
// @route POST api/v1/auth/users
// @access Public
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)
  if(!user) {
    return next(new ErrorResponse('Something wrong with information', 400))
  }
  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  res.status(200).json({success: true, message: 'Create new user successfully', data: user})
})



// @desc Update a single user
// @route PUT api/v1/auth/users/:id
// @access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})


  if (!user) {
    return next(new ErrorResponse(`Update user with id ${req.params.id} failed`, 400))
  }

  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  res.status(400).json({success: true, message: 'Update user successfully', data: user})
})


// @desc Delete a user
// @route Delete api/v1/auth/users/:id
// @access Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    return next(new ErrorResponse(`Delete user with id ${req.params.id} failed`, 401))
  }
  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  res.status(200).json({success: true, message: 'Delete user successfully ', data: user})
})