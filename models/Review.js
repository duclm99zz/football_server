const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Please add a comment review'],
    trim: true,
    unique: true,
    minlength: [5, 'The comment need at least 5 letters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: [1, 'Rating number need to be greater than 1'],
    max: [10, 'Rating number need to be less than 10']
  },
  reviewedBy: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  post: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Post'
  }
})

ReviewSchema.statics.setAverageRating = async function(postId) {
  const object = await this.aggregate([
    {$match: {post: postId}},
    {
      $group: {
        _id: '$post',
        averageRating: {$avg: '$rating'}
      }
    }
  ])
  try {
    await this.model('Post').findByIdAndUpdate(postId, {
      averageRating: object[0].averageRating
    })
  } catch (error) {
    console.log(error)
  }
}

// Call getAverageRating after save
ReviewSchema.post('save', function() {
  this.constructor.setAverageRating(this.post)
})

// Call getAverageRating before remove
ReviewSchema.pre('remove', function() {
  this.constructor.setAverageRating(this.post)
})




module.exports = mongoose.model('Review', ReviewSchema)