// Need to install dotenv first to be able to use env variables
// require('dotenv').config({path: __dirname + '/.env'})
// const { PASSWORD } = process.env
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

// If you use _ also as the 2nd variable, an error arises
const [_, __, password, name, number] = process.argv
// console.log(password, name, number)

// The URL deleted. The password was savec in a dotenv file.
// const url = `mongodb+srv://fullstack:${password}@...`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

// the schema and model is called "Contact"
// therefore the collection will be named "contacts"
const contactSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Contact = mongoose.model('Contact', contactSchema)

if (name && number) {
    const contact = new Contact(
        { "name": name, "number": number }
    )
    contact.save().then( result => {
        console.log(`${name} number ${number} is saved to phonebook.`)
        mongoose.connection.close()
    })
} else if (name || number) {
    // Note: Inside this branch, you have to close the connection too
    // or it won't stop running
    console.log("Contact information is not complete.")
    mongoose.connection.close()
} else {
    Contact.find({}).then( result => {
        result.forEach(
            contact => {
                console.log(contact.name, contact.number)
            }
        )
        mongoose.connection.close()
    }
)}
