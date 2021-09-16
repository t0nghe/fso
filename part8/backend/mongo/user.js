require('dotenv').config()
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const { MONGODB_URI } = process.env
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 4
    },
    favoriteGenre: {
      type: String,
    },
    passwordHash: {
      type: String,
    }
  })

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)