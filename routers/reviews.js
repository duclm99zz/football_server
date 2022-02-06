const express = require('express')

const {
  getReviewsByPost,
  updateReview,
  deleteReview,
  createReview
} = require('../controllers/reviews')
const { protect } = require('../middleware/auth')
const router = express.Router({mergeParams: true})

router.route('/').post(protect, createReview).get(protect,getReviewsByPost)
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview)

module.exports = router