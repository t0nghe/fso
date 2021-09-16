const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }
  next()
}

const userExtractor = (request, response, next) => {

  if (! request.token ) {
    return response.status(401).json({ error: 'token missing' })
  }

  const decryptedToken = jwt.verify(request.token, process.env.SECRET)

  if ( !decryptedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  // In this MW function, we only decode a userid
  // which may have changed/deleted from system
  // after the user obtained the token.
  // So we still need to check if the user still exist
  request.user = decryptedToken.id
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'BlogNotFound') {
    return response.status(404).json({error: error.message})
  } else if (error.name === 'InvalidUsernameOrPassword' || error.name ==='NotAuthorized' ) {
    return response.status(401).json({error: error.message})
  } else if (error.name = 'UserDoesNotExist') {
    return response.status(400).json( {error: error.message} )
  } else if (error.name = 'PassNotSupplied') {
    return response.status(400).json( {error: error.message} )
  } else if (error.name = 'PassTooShort') {
    return response.status(400).json( {error: error.message} )
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}