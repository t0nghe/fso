const logger = require('../utils/logger')
const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const Blog = require('./blog')

// logger.info("Inside blog.js")
const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true, minLength: [3, 'username too short']},
    name: {type: String, required: true},
    passwordHash: String,
    blogs: [ {type: mongoose.Schema.Types.ObjectId, ref: "Blog"} ]
  })

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.passwordHash
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('User', userSchema)