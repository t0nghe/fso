const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
require('express-async-errors')
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

// For Ex 4.8: Refactoring code to use async/await
// also added express-async-errors
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blogEntry = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (blogEntry===null) {
    const err = new Error("blog does not exist")
    err.name = "BlogNotFound"
    throw err
  } else {
    response.json(blogEntry)
  }
})

// 4.13
// This seems similar to one of the previous exercise in phone book.
// findByIdAndRemove returns null when it's not found.
// in which case we return 404 `not found`.
// otherwise it returns the object being deleted.
// in which case we send to the user 204 `no content`
// 4.21
// make sure only the user who added the blog can delete it
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const userid = request.user
  const blogid = request.params.id
  const blog = await Blog.findById(blogid)

  if (blog === null) {
    const err = new Error("blog does not exist")
    err.name = "BlogNotFound"
    throw err
    // return response.status(404).send({'error': 'blog does not exist'})
    // To test if the error handling package works,
    // I didn't write next(err).
  }

  // Blogs created before implementing the user auth didn't 
  // have a user field. If that property is undefiend,
  // it certainly wasn't created by the user.
  if (blog.user===undefined || blog.user.toString() !== userid.toString() ) {
    const err = new Error('not allowed to delete a blog created by others')
    err.name = "NotAuthorized"
    throw err
  }
  
  await User.findByIdAndUpdate(userid,
    { "$pull": { "blogs": blogid } }
  )

  const res = await Blog.findByIdAndRemove(request.params.id)
  if (res !== null) {
    response.status(204).end()
  }
})

// 4.14
// Again, we've done similar stuff for phonebook
// Since we disabled creating new blogs whose title or URL is empty
// - we should probably also enforce the same validators for this endpoint
// - Add user validation to make sure the user can only modify their own blog
blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const body = request.body
  const userid = request.user
  const blog = await Blog.findById(request.params.id)
  
  if (blog === null) {
    const err = new Error("blog does not exist")
    err.name = "BlogNotFound"
    throw err
  }

  if (Object.keys(body).length === 1 && Object.keys(body).includes('likes')) {
    const res = await Blog.findByIdAndUpdate(request.params.id, body)
    response.send(res)
  } else {
    if (blog.user===undefined || blog.user.toString() !== userid.toString() ) {
      const err = new Error('not allowed to update a blog created by others')
      err.name = "NotAuthorized"
      throw err
    }
  
    const res = await Blog.findByIdAndUpdate(request.params.id, body, { runValidators: true })
    response.send(res)
  }
})

// This if check works.
// But if we implement something on Mongoose, the put method will also be taken care of
blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const userid = request.user

    const defaultValues = { likes: 0, user: userid }
    const blogEntry = {...defaultValues, ...body}
    const blog = new Blog(blogEntry)
    
    // This takes care of the case where the user is removed 
    // from DB after obtaining a token.
    const user = await User.findById(userid)
    if (user===null) {
      const err = new Error('user not found')
      err.name = 'UserDoesNotExist'
      throw err
    }
    user.blogs = user.blogs.concat(blog._id)
    await user.save()

    const result = await blog.save()
    response.status(201).json(result)
})

module.exports = blogsRouter