const asyncHandler = require('../middleware/asyncHandler')
const ErrorResponse = require('../utils/errorResponse')
const Post = require('../models/Post')



exports.getPosts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

exports.getPostById = asyncHandler (async (req, res, body) => {



  const post = await Post.findById(req.params.id)
  // .populate({
  //   path: 'courses',
  //   select: 'title description tuition'
  // })
  if (!post) {
    return next(new ErrorResponse(`Post with id ${req.params.id} not found`, 400))
  }

  res.status(200).json({success: true, data: post})
})


exports.updatePost = asyncHandler (async (req, res, next) => {
  const post = await Post.findById(req.params.id)
  if (post.publishedBy.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse('Not authorized to update the post', 402))
  }
  const newPost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

  res.status(200).json({success: true, data: newPost})
})


exports.deletePost = asyncHandler (async (req, res, next) => {
  const post = await Post.findById(req.params.id)
  if (post.publishedBy.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse('Not authorized to update the post', 402))
  }
  await post.remove(req.params.id)

  res.status(200).json({success: true, data: {}})
})



exports.createPost = asyncHandler(async (req, res, next) => {
  req.body.publishedBy = req.user.id

  const postByPublisher = await Post.find({publishedBy: req.user.id })
  if (postByPublisher.length > 2) {
    return next(new ErrorResponse('A publisher can not have more than 2 post', 400))
  }

  if(req.user.role !== 'admin' && req.user.role !== 'publisher') {
    return next(new ErrorResponse('Not authorized to create the post', 400))
  }
  const post = await Post.create(req.body)

  if (!post) {
    return next(new ErrorResponse('Create post failed, please try again!', 400))
  }

  res.status(200).json({success: true, message: 'Created successfully', data: post})
})