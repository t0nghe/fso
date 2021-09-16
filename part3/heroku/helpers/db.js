const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// console.log("line 3")
// require('dotenv').config({ path: '.env' })
const { MONGODB_URI } = process.env
// console.log("line 6")
// console.log(MONGODB_URI)
// console.log("line 8")

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: [3, "Path `name` (`{VALUE}`) is shorter than the minimum allowed length (3)."],
      required: true,
      unique: true,
    },
    number: {
      type: String,
      validate: {
        validator: (num) => {
          const digits = Array.from(num).filter(
              char => "0123456789".includes(char)
          )
          return digits.length >= 8
      },
      message: "Path `number` (`{VALUE}`) is shorter than the minimum allowed length (8)."
      }
    }
})
contactSchema.plugin(uniqueValidator)

// Following transformation lifted from tutorial.
contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Contact', contactSchema)

// const fetchAll = () => {
//   Contact.find({}).then(result => {
//     result.forEach(item => {
//       console.log(item.toJSON())
//     })
//     mongoose.connection.close()
//   })
// }

// fetchAll()
