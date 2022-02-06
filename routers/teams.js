const express = require('express')
const { createTeam, getTeams, getTeamById, updateTeam, deleteTeam } = require('../controllers/teams')
const Team = require('../models/Team')
const advancedResults = require('../middleware/advancedResult')
const playerRouter = require('./players')
const managerRouter = require('./managers')
const competitionRouter = require('./competitions')
const {protect, authorize} = require('../middleware/auth')
const router = express.Router()



router.use('/:teamId/competitions', competitionRouter)
router.use('/:teamId/managers', managerRouter)
router.use('/:teamId/players', playerRouter)
router.route('/').post(protect, authorize('admin'),createTeam).get(advancedResults(Team), getTeams)
router.route('/:id').get(getTeamById).put(protect, authorize('admin'),updateTeam).delete(protect,authorize('admin'),deleteTeam)

module.exports = router