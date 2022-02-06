const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const colors = require('colors')
const logger = require('./middleware/logger')
const errorHandler = require('./middleware/errors')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmetSecurity = require('helmet')
const xssClean = require('xss-clean')
const limit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

dotenv.config({path: './config/config.env'})
connectDB()
const app = express()
app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(mongoSanitize())
// Security header
app.use(helmetSecurity())
// Prevent xss attacker
app.use(xssClean())
// Rate limiting
const limiter = limit({
  windowMs: 10 * 60 * 60 *1000, // 10 mins
  max: 100
})
app.use(limiter)
// prevent htpp param pollution
app.use(hpp())
// Enable CORS
app.use(cors())


// Routes files
const manager = require('./routers/managers')
const player = require('./routers/players')
const team = require('./routers/teams')
const competition = require('./routers/competitions')
const user = require('./routers/users')
const auth = require('./routers/auth')
const post = require('./routers/posts')
const review = require('./routers/reviews')



app.use(logger)
app.use('/api/v1/players', player)
app.use('/api/v1/teams', team)
app.use('/api/v1/managers', manager)
app.use('/api/v1/competitions', competition)
app.use('/api/v1/users', user)
app.use('/api/v1/auth', auth)
app.use('/api/v1/posts', post)
app.use('/api/v1/reviews', review)
app.use(errorHandler)


const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server listening in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold)
})

process.on('unhandledRejection', (err, promise) => {
  console.log('Error:', err.message.red)
  server.close(() => process.exit(1))
})