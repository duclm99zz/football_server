const mongoose = require('mongoose')

const ManagerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Please add manager name']
  },
  birthday: {
    type: Date,
    required: [true, 'Please add a birthday']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  positions: {
    type: String,
    unique: true,
    enum: ['Head Coach', 'Assistant Head Coach', 'Goalkeeper Coach', 'Fitness coach' , 'Recovery Coach' ,'Physiotherapy Coach', 'Nutrition Coach', 'Analysis Department']
  },
  salary: Number,
  yearContract: {
    type: Number,
    required: true
  },
  teamId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Team'
  }

})


ManagerSchema.pre('remove', async function(next) {
  let team = await this.model('Team').findById(this.teamId)

  let currentManager = team.managers
  team.managers  = currentManager.filter(manager => JSON.stringify(manager._id) !== JSON.stringify(this._id))
  
  await team.save()
  next()
})


module.exports = mongoose.model('Manager', ManagerSchema)