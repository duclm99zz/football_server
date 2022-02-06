const ErrorResponse = require('../utils/errorResponse')
const Player = require('../models/Player')
const asyncHandler = require('../middleware/asyncHandler')
const Team = require('../models/Team')

// @desc Get All Players
// @route GET api/v1/players
// @route GET api/v1/teams/:teamId/players
// @access Public
exports.getPlayers = asyncHandler(async (req, res, next) => {
  if (req.params.teamId) {
    const player = await Player.find({teamId: req.params.teamId}).select(
      {
        location: 0, 
       createdAt: 0,
       teamId: 0
      }
    )
    return res.status(200).json({
      success: true,
      count: player.length,
      data: player
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc Update A Player
// @route PUT api/v1/players/:id
// @access Public
exports.updatePlayer = asyncHandler(async (req, res, next) => {
  let player = await Player.findById(req.params.id)
  if(!player) {
    return next(new ErrorResponse(`No player with the id of ${req.params.id}`, 404))
  }
  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  player = await Player.findByIdAndUpdate(req.params.id,req.body ,{new: true, runValidators: true})
  res.status(200).json({success: true, data: player})
})


// @desc Delete a Player
// @route Delete /api/v1/players/:id
// @access Public

exports.deletePlayer = asyncHandler(async (req, res, next) => {
  const player = await Player.findById(req.params.id)
  if (!player) {
    return next(new ErrorResponse(`No player with the id of ${req.params.id}`, 404))
  }
  if( req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this course `, 401))
  }
  await player.remove()
  res.status(200).json({
    success: true,
    message: `Delete player with id ${player._id} successfully`
  })
})


// @desc Get A Single Player
// @route GET /api/v1/players/:id
// @access Public

exports.getPlayerById = asyncHandler(async (req, res, next) => {
  const player = await Player.findById(req.params.id).select({location: 0}).populate({
    path: 'teamId',
    select: {team_name: 1}
  })
  if (!player) {
    return next(new ErrorResponse(`Player not found with id of ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: player
  })
})





// @desc Create A Player
// @route POST api/v1/:teamId/players
// @access Public
exports.createPlayer = asyncHandler(async (req, res, next) => {
  req.body.teamId = req.params.teamId
  let team = await Team.findById(req.params.teamId)
  if (!team) {
    return next(new ErrorResponse(`No team with the id of ${req.body.teamPlayingId}`, 404))
  }
  const player = await Player.create(req.body)
  team = await Team.findByIdAndUpdate(req.params.teamId, 
    {$push: { players: {_id:player._id , player_name: player.fullName} } },
    { new: true }
  )

  res.status(201).json({ success: true, data: player})
})