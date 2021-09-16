const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3001
const Contact = require('./helpers/db')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

morgan.token('body', (req, res) =>{ return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
    skip: function (req, res) { return req.method != 'POST'}
}))

app.get('/api/persons', (req, res, next) => {
    Contact.find({}).then(
        result => res.json(result)
    ).catch( error=>next(error) )
})

// Still need to take care of the case where the response is null
app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    Contact.findById(id).then(
        result => {
            // console.log(result)
            res.json(result)
        }
    ).catch(
        error=> { next(error) }
    )
})

app.get('/info', (req, res, next)=> {
    const date = new Date()
    const tstring = date.toString()

    Contact.find({}).count().then(
        result => res.send(`<html><body><p>Phone book has info for ${result} people.</p><p>${tstring}</p></body></html>`)
    ).catch( error => next(error) )

})

app.delete('/api/persons/:id', (req, res, next)=>{
    Contact.findByIdAndRemove(req.params.id,
        (err, result) => {
                if (result) {
                    // console.log(result)
                    res.status(204).end()
                } else {
                    const nonExistent = Error(`Item '${req.params.id}' did not exist in database.`)
                    nonExistent.name = "NonExistent"
                    next(nonExistent)
                }
        }
        )
})

app.post('/api/persons/', (req, res, next)=>{
    const record = req.body
    Contact.create(record).then(
        result => {
            res.json(result)
        }
    ).catch(
        error=> next(error)
    )
})

// Don't know if this is the best way to unpack the result
// But the result is a Mongoose response object
// getting stuff out of it is actually a bit complicated
app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const updatedContact = req.body
    // From the docs:
    // By default, if you don't include any update operators in update, Mongoose will wrap update in $set for you.
    // - Thanks that's considerate of you!
    Contact.findByIdAndUpdate(id, updatedContact, { runValidators: true } ).then(
        result => {
            const newRecord = {
                "id": id,
                "name": result.name,
                "number": result.number
            }
            // console.log(newRecord)
            res.json({
                ...newRecord,
                ...updatedContact
            })
        }
    ).catch( error => next(error))
}
)

const errorHandler = (error, req, res, next) => {
    switch (error.name) {
        case "CastError":
            return res.status(400).send({ "error": "The requested ID is wrong." })
            break;
        case "ValidationError":
            return res.status(400).send({ "error": error.message })
            break;
        case "NonExistent":
            return res.status(404).send({ "error": error.message })
            break;
        default:
            res.status(400).end()
    }
    next(error)
}

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})