const asyncHandler = require('../middleware/asyncHandler')
const Manager = require('../models/Manager.js')
const Team = require('../models/Team')
const ErrorResponse = require('../utils/errorResponse')


exports.getManagers = asyncHandler(async (req, res, next) => {
  if (req.params.teamId) {
    const manager = await Manager.find({teamId: req.params.teamId}).select(
      { 
       createdAt: 0,
       teamId: 0
      }
    )
    return res.status(200).json({
      success: true,
      count: manager.length,
      data: manager
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

exports.getManagerById = asyncHandler (async (req, res, next) => {
  const manager = await Manager.findById(req.params.id)

  if (!manager) {
    return next(new ErrorResponse(`Not manager with id ${req.params.id} found`, 404))
  }

  res.status(200).json({success: true, message: 'Get a manager information successfully', data: manager})
})


exports.addManagerToTeam = asyncHandler(async (req, res, next) => {
  req.body.teamId = req.params.teamId
  let team = await Team.findById(req.params.teamId)
  if (!team) {
    return next(new ErrorResponse(`No team with id ${req.params.teamId} found`, 404))
  }
  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  const manager = await Manager.create(req.body)
  team = await Team.findByIdAndUpdate(req.params.teamId, 
    {$push: { managers: {_id:manager._id , manager_name: manager.fullName} } },
    { new: true }
  )

  res.status(200).json({success: true, message: 'Create a new manager successfully', manager})
})

exports.updateManager = asyncHandler (async (req, res, next) => {
  let manager = await Manager.findById(req.params.id)

  if (!manager) {
    return next(new ErrorResponse(`Not manager with id ${req.params.id} found`, 404))
  }
  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  manager = await Manager.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
  res.status(200).json({success: true, message: 'Update a manager information successfully', data: manager})
})

exports.deleteManager = asyncHandler (async (req, res, next) => {
  let manager = await Manager.findById(req.params.id)

  if (!manager) {
    return next(new ErrorResponse(`Not manager with id ${req.params.id} found`, 404))
  }
  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  await manager.remove()
  res.status(200).json({success: true, message: 'Delete a manager successfully', data: manager})
})