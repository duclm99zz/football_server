const mongoose = require('mongoose')

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI  || 'mongodb+srv://duclm99:leminhduc99@duclm031099.dqkxo.mongodb.net/footballBackend?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true
  })
  console.log('MongoDB connected: ', conn.connection.host.cyan.underline.bold)
}

module.exports = connectDB