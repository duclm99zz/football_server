const mongoose = require('mongoose')
const CompetitionSchema = new mongoose.Schema({
  competition_name: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please add a competition name']
  },
  description: String,
  number_team: {
    type: Number,
    required: [true, 'Please add number of team'],
    min: 1
  },
  start_date: {
    type: Date,
    required: [true, 'Please add a start time of competition']
  },
  end_date: {
    type: Date,
    required: [true, 'Please add a end time of competition']
  },
  money_award: {
    type: Number,
    required: [true, 'Please add amount of money when become the champion'],
    min: 100
  },
  teamId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Team'
  }

})


CompetitionSchema.pre('remove', async function(next) {
  let team = await this.model('Team').findById(this.teamId)

  let currentCompetition = team.competitionPlaying
  team.competitionPlaying  = currentCompetition.filter(compe => JSON.stringify(compe._id) !== JSON.stringify(this._id))
  
  await team.save()
  next()
})

module.exports = mongoose.model('Competition', CompetitionSchema)