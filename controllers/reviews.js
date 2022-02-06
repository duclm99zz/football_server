const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Review = require('../models/Review')
const Post = require('../models/Post')

exports.getReviewsByPost = asyncHandler (async (req, res, next) => {
  const post = await Post.findById(req.params.postId)
  if (!post) {
    return next (new ErrorResponse('Post with that id not found!', 404))
  }
  const reviews = await Review.find({post: req.params.postId})
  if(!reviews)  {
    return next(new ErrorResponse('Get reviews for post failed!', 401))
  }
  res.status(200).json({success: true, data: reviews})
})

exports.updateReview = asyncHandler (async (req, res, next) => {
  let reviews = await Review.findById(req.params.id)
  if(!reviews)  {
    return next(new ErrorResponse(`Review with id ${req.params.is} not found`, 401))
  }
  reviews = await Review.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
  if (!reviews) {
    return next( new ErrorResponse('Update reivew failed', 400))
  }
  res.status(200).json({success: true, data: reviews})
})


exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)

  if(!review) {
    return next(new ErrorResponse(`Review with id ${req.params.id} not found`, 400)) 
  }

  await review.remove()

  res.status(200).json({success: true, data: {}})
})


exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.post = req.params.postId
  req.body.reviewedBy = req.user.id

  const post = await Post.findById(req.params.postId)

  if(!post) {
    return next (new ErrorResponse(`Post with id ${req.params.postId} not found`, 400))
  }

  const review = await Review.create(req.body)

  if (!review) {
    return next(new ErrorResponse('Create comment failed, please try again!', 400))
  }

  res.status(200).json({success: true, data: review})
})