const express = require('express')
const Competition = require('../models/Competition')
const AdvancedResults = require('../middleware/advancedResult')
const {
  getCompetitions,
  getCompetitionById,
  updateCompetition,
  deleteCompetition,
  createCompetition
} = require('../controllers/competitions')
const {protect, authorize} = require('../middleware/auth')
const router = express.Router({mergeParams: true})


router.route('/').get(AdvancedResults(Competition), getCompetitions).post(protect, authorize('admin'),createCompetition)
router.route('/:id').get(getCompetitionById).put(protect, authorize('admin'), updateCompetition).delete(protect, authorize('admin'),deleteCompetition)




module.exports = router