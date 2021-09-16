const testingRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.get('/reset', async (request, response) => {
    response.status(200).send("hello")
  }
)

testingRouter.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
  }
)

module.exports = testingRouter