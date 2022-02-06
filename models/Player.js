const mongoose = require('mongoose')
const geocoder = require('../utils/geocoder')
const slugify = require('slugify')

const PlayerSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  slug: String,
  phoneNumber: {
    type: String,
    maxlength: [20, 'Phone number can not be longer than 20 characters']
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
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  birthday: {
    type: Date,
    default: new Date()
  },
  status: {
    type: String,
    required: true,
    enum: [
      'Amazing',
      'Ready',
      'Bad',
      'Injured',
      'Long Injured',
      'Other'
    ]
  },
  positions: {
    type: [String],
    required: true,
    enum: [
      'Goalkeeper',
      'Defender Centre-back',
      'Defender Wing-back',
      'Centre midfield',
      'Attacking midfield',
      'Wide midfield',
      'Centre forward',
      'Winger'
    ]
  },
  salePrice: {
    type: Number,
    required: true
  },
  salary: Number,
  number_shirt: Number,
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



PlayerSchema.pre('remove', async function(next) {
  let team = await this.model('Team').findById(this.teamId)

  let currentPlayers = team.players
  team.players  = currentPlayers.filter(player => JSON.stringify(player._id) !== JSON.stringify(this._id))
  
  await team.save()
  next()
})

PlayerSchema.pre('save', function(next){ 
  geocoder.geocode(this.address).then(loc => {
    this.location = {
      type: 'Point',
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      street: loc[0].streetName,
      city: loc[0].city,
      state: loc[0].stateCode,
      zipcode: loc[0].zipcode,
      country: loc[0].countryCode
    }

    this.address = undefined
    next()
  }).catch(err => console.error('Geocoder failed',err))

  
})


module.exports  = mongoose.model('Player', PlayerSchema)