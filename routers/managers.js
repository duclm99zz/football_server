const express = require('express')
const advancedResults  = require('../middleware/advancedResult')
const Manager = require('../models/Manager')
const { 
  getManagers, 
  addManagerToTeam, 
  getManagerById,
  updateManager,
  deleteManager
} = require('../controllers/managers')
const {protect, authorize} = require('../middleware/auth')
const router = express.Router({mergeParams: true})



router.route('/').get(advancedResults(Manager),getManagers).post(protect, authorize('admin'),addManagerToTeam)
router.route('/:id').get(getManagerById).put(protect, authorize('admin'),updateManager).delete(protect, authorize('admin'),deleteManager)

module.exports = router