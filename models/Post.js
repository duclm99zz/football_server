const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: [20, 'The length of post is at least 20 letters'],
    required: [true, 'Please add content to the post']
  },
  title: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Please add title to the post'],
    minlength: [10, 'Title need at least 10 letters']
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  topic:{
    type: String,
    required: true,
    enum: [
      'Player',
      'Manager',
      'Team',
      'Tranfer',
      'Budget'
    ]
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [10, 'Rating must can not be more than 10']
  },
  publishedBy: {     
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User'
  }
  
})




PostSchema.pre('remove', async function(next) {
  const reviews = await this.model('Review').deleteMany({post: this._id})
  console.log('Delete all review of the post ', reviews)
  next()
})



module.exports = mongoose.model('Post', PostSchema)