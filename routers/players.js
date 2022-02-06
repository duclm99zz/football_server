const express = require('express')
const { 
  getPlayers, 
  createPlayer,
  deletePlayer,
  updatePlayer,
  getPlayerById
 } = require('../controllers/players')
const Player = require('../models/Player')
const advancedResults = require('../middleware/advancedResult')
const {protect, authorize} = require('../middleware/auth')
const router = express.Router({ mergeParams: true})




router.route('/').post(protect, authorize('admin'),createPlayer).get(advancedResults(Player, {path: 'teamId', select: 'fullName positions' }), getPlayers)
router.route('/:id').get(getPlayerById).put(protect, authorize('admin'),updatePlayer).delete(protect, authorize('admin'),deletePlayer)

module.exports = router