const express = require('express')
const advancedResults = require('../middleware/advancedResult')
const { protect, authorize} = require('../middleware/auth')

const router = express.Router({mergeParams: true})

const User = require('../models/User')
const {
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  createUser
} = require('../controllers/users')



router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedResults(User), getUsers).post(protect,createUser)
router.route('/:id').get(getUserById).put(protect,updateUser).delete(protect,deleteUser)




module.exports = router