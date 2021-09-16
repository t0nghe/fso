const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
require('express-async-errors')

// 4.18
// This Exercise only takes care of logging in
// Creating new uses is handled by /api/users/
loginRouter.post('/', async (request, response) => {
    const body = request.body
    
    const user = await User.findOne( { username: body.username })

    // I suppose the point is to prevent hackers
    // from guessing the right username.
    const passwordCorrect = (user === null)
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

    // Since we are using express-async-errors
    if (! (user && passwordCorrect)) {
        const err = new Error("invalid username or password")
        err.name = "InvalidUsernameOrPassword"
        throw err
    }
    
    const userDetails = { username: user.username, id: user._id }
    const token = jwt.sign(userDetails, process.env.SECRET)
    response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter