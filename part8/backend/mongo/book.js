require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const Author = require('./author')

const { MONGODB_URI } = process.env
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const bookSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      unique: true,
      minlength: 2
    },
    published: {
      type: Number,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author'
    },
    genres: [
      { type: String}
    ]
  })
  bookSchema.plugin(uniqueValidator)
  
  module.exports = mongoose.model('Book', bookSchema)