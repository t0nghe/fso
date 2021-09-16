const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./router/blogs')
const usersRouter = require('./router/users')
const longinRouter = require('./router/login')
const testingRouter = require('./router/e2etest')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

logger.info(config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }).then(
    ()=> {
        logger.info('Connected to db')
    }
).catch(
    (error) => {
        logger.error(error)
    }
)

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', longinRouter)

if (process.env.NODE_ENV==="test") {
    app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app