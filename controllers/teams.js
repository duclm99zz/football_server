const ErrorResponse = require('../utils/errorResponse')
const Team = require('../models/Team')
const asyncHandler = require('../middleware/asyncHandler')

exports.getTeams = asyncHandler(async (req, res, next) => {

  res.status(200).json(res.advancedResults)
})

exports.getTeamById = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id)

  if(!team) {
    return next (new ErrorResponse(`No team with id ${req.params.id} found`, 404))
  }
  res.status(200).json({success: true, data: team})
})

exports.updateTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id)

  if(!team) {
    return next(new ErrorResponse(`No team with id ${req.params.id} found`, 404))
  }
  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  await Team.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

  res.status(200).json({success: true, message: "Update team successfully", data: team})
})

exports.deleteTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.findById(req.params.id)

  if(!team) {
    return next (new ErrorResponse(`No team with id ${req.params.id} found`, 404))
  }
  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  await team.remove()

  res.status(200).json({success: true, message: `Delete a team  successfully`, team})
})



exports.createTeam = asyncHandler(async (req, res, next) => {
  const team = await Team.create(req.body)
  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  res.status(201).json({ success: true, data: team})
})

