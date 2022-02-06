const asyncHandler = require('../middleware/asyncHandler')
const Competition = require('../models/Competition')
const ErrorResponse = require('../utils/errorResponse')
const Team = require('../models/Team')


exports.getCompetitions = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

exports.getCompetitionById = asyncHandler(async (req, res, next) => {
  const comp = await Competition.findById(req.params.id)

  if(!comp) {
    return next(new ErrorResponse(`Not competition with id ${req.params.id} found`, 404))
  }

  res.status(200).json({success: true,message: 'Get single competition successfully' ,data: comp})
})


exports.createCompetition = asyncHandler(async (req, res, next) => {
  if (!req.params.teamId) {
    return next(new ErrorResponse('Not correct params', 400))
  }
  req.body.teamId = req.params.teamId

  const team = await Team.findById(req.params.teamId)
  if(req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  if (!team) {
    return next(new ErrorResponse( `Team with id ${req.params.teamId} not found`, 404))
  }
  const { start_date, end_date } = req.body
  if ( Date.parse(end_date) < Date.parse(start_date) || Date.parse(start_date)  < Date.now()  || Date.parse(end_date) < Date.now()) {
    return next(new ErrorResponse('Invalid time. Try again', 400))
  }
  const compe = await Competition.create(req.body)

  await Team.findByIdAndUpdate(req.params.teamId, {
    $push: {competitionPlaying: {_id: compe._id, competition_name: compe.competition_name}}
  }, {new: true, runValidators: true})

  res.status(200).json({success: true, message: 'Create new competition successfully', data: compe})
})



exports.updateCompetition = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorResponse('Not correct params', 400))
  }
  let comp = await Competition.findById(req.params.id)

  if (!comp) {
    return next(new ErrorResponse(`Can not found competition with id ${req.params.id}`))
  }
  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  
  comp = await Competition.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

  res.status(200).json({success: true, message: 'Update competition successfully', data: comp})

})


exports.deleteCompetition = asyncHandler(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorResponse('Not correct params', 400))
  }

  let comp = await Competition.findById(req.params.id)

  if(!comp) {
    return next(new ErrorResponse(`Competition with id ${req.params.id} not found`, 400))
  }

  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }

  await comp.remove()

  res.status(200).json({success: true, message: 'Delete competition successfully', data: comp})
})