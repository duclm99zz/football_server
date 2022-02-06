const express = require('express')
const advancedResult = require('../middleware/advancedResult')
const Post = require('../models/Post')
const {
  getPostById,
  getPosts,
  updatePost,
  deletePost,
  createPost
} = require('../controllers/posts')
const { protect, authorize} = require('../middleware/auth')
const router = express.Router()
const reviewRouter = require('./reviews')

router.use('/:postId/reviews', reviewRouter)

router.route('/').get(advancedResult(Post),getPosts ).post(protect, authorize('admin', 'publisher'), createPost)
router.route('/:id').get(getPostById).put(protect, authorize('publisher','admin'), updatePost).delete(protect,authorize('publisher','admin'), deletePost)


module.exports = router