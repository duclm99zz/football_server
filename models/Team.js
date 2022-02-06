const mongoose = require('mongoose')
const slugify = require('slugify')

const TeamSchema = new mongoose.Schema({
  team_name: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    enum: [
      'Chelsea FC',
      'Chelsea WFC',
      'U18 Chelsea'
    ]
  },
  players: [{_id:{type: mongoose.Schema.ObjectId, ref: 'Player'}, player_name: String}],
  slug: String,
  managers: [{
    _id:{
      type: mongoose.Schema.ObjectId,
      ref: 'Team',
      required: [true, 'Please add a manager id']
    },
    manager_name: {
      type: String,
      required: [true, 'Please add a manager name']
    }
  }],
  competitionPlaying: [{
    _id:{
      type: mongoose.Schema.ObjectId,
      ref: 'Team',
      required: [true, 'Please add a competition id']
    },
    competition_name: {
      type: String,
      required: [true, 'Please add a competition name']
    }
  }

  ]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true}
})
TeamSchema.pre('save', function(next) {
  this.slug = slugify(this.team_name, { lower: true })
  next()
})


// TeamSchema.virtuals('players', {
//   ref: 'Comment',
//   localField: '_id',
//   foreignField: 'bootcampId',
//   justOne: false
// })


TeamSchema.pre('remove', async function(next) {
  await this.model('Player').deleteMany({teamId: this._id})
  await this.model('Manager').deleteMany({teamId: this._id})
  next()
})
module.exports = mongoose.model('Team', TeamSchema)