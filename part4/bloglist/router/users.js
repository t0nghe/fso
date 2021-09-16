const logger = require('../utils/logger')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
require('express-async-errors')
const User = require('../models/user')

// the instruction doesn't specify if we need a token to see this
usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', { url: 1, title:1, author:1, id:1})
    response.status(200).send(users)
})

usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id).populate('blogs', { url: 1, title:1, author:1, id:1})
    if (user===null) {
    const userError = new Error('user does not eixst')
        userError.name = 'UserDoesNotExist'
        throw userError
    }
    response.status(200).send(user)
})

usersRouter.post('/', async (request, response) => {
    const body = request.body
    const saltRounds = 11

    if (! body.password) {
        const passError = new Error("password is required")
        passError.name = 'PassNotSupplied'
        throw passError
    }

    if ( body.password.length < 3 ) {
        const passError = new Error("password needs to contain three or more characters")
        passError.name = 'PassTooShort'
        throw passError
    }

    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    // Save the hashed password to DB
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
        blogs: []
      })

    // There will possibly be a validation error
    // thrown by Mongoose uniqueValidator
    // if the username is duplicate.
    const createdUser = await user.save()
    response.json(createdUser)
})

module.exports = usersRouter
