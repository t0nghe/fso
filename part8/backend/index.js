require('dotenv').config()
const { ApolloServer } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const { v4: uuidv4 } = require('uuid')
const mongoose = require('mongoose')
const Book = require('./mongo/book')
const Author = require('./mongo/author')
const User = require('./mongo/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 11
const typeDefs = require('./typeDefs')
const ObjectId = require('mongoose').Types.ObjectId

const { TOKEN_SECRET } = process.env

const resolvers = {
  Query: {
  bookCount: async () => {
    const allBooks = await Book.find()
    return allBooks.length
  },
  allGenres: async () => {
    const theseGenres = await Book.find({}, {genres: 1})
    const reduced = theseGenres.reduce(
    (a, b) => {
      const agenres = a.genres
      console.log('agenres', agenres)
      const bgenres = b.genres
      console.log('bgenres', bgenres)
      return { genres: [...agenres, ...bgenres]}
    }, { genres: []}
    )
    const ourSet = new Set(reduced.genres)
    return ourSet
  },
  authorCount: async () => {
    const allAuthors = await Author.find()
    return allAuthors.length
  },
  allBooks: async (root, args) => {
    let filteredBooks = await Book.find().populate('author')
    // TODO This if-strut needs to be fixed
    if (args) {
    const { author, genre } = args
    if ( author ) {
      filteredBooks = filteredBooks.filter( item => item.author === author )
    }
    if ( genre ) {
      filteredBooks = filteredBooks.filter( item => item.genres.includes(genre) )
    }
    }

    const returnBooks = filteredBooks.map( item => {
      const { title, published, genres, author } = item
      return {
        title, published, genres, author
      }
    })
    return returnBooks
  },
  allAuthors: async () => {
    const authors = await Author.find()
    const books = await Book.find()
    const authorInfo = authors.map( item => {
      const name = item.name;
      const authId = item._id.toString();
      const born = item.born;    
      const bookCount = books.filter( item => { try {
      if (item.author.toString() === authId) {
        return true
      }
      } catch {
      return false
      }}).length
    return { name, born, bookCount }
    });
    return authorInfo;
  },
  me: async (root, args, context) => {
    if (Object.keys(context).length !== 0) {
    return { username: context.username,
      favoriteGenre: context.favoriteGenre,
      id: context.id
    }
    } else {
    throw new Error("No user logged in.")
    }
    
  }
  },
  Mutation: {
  addBook: async (root, args, context) => {
    if (Object.keys(context).length === 0) {
    throw new Error("Need to log in.")
    }

    const { title, author, published, genres } = args
    let authId = ''
    
    const foundAuthor = await Author.findOne({name: author})
    // What could be wrong might have been this:
    if (!foundAuthor) {
    try {
      console.log('newAuthor branch fired')
      const newAuthor = new Author({ name: author, bookCount: 1})
      const res = await newAuthor.save()
      console.log('res after new item saved: ', res)
      authId = res._id
    } catch (e) {
      throw new Error(e.message)
    }
    } else {
    await foundAuthor.updateOne({ "$inc": {bookCount: 1}})
    authId = foundAuthor._id
    }
    // console.log(authId)

    // Again, this is not the right way to handle errors.
    // I suppose, on the client side (React/Apollo), the standard
    // GraphQL error can be properly handled.
    let returnBook
    try {
    const newBook = new Book({ title, author: authId, published, genres })
    returnBook = await newBook.save()
    // console.log('returnBook', returnBook)
    } catch (e) {
      throw new Error(e.message)
    }

    const fullAuthor = await Author.findById(authId)
    returnBook.author = fullAuthor

    pubsub.publish('BOOK_ADDED', {bookAdded: returnBook })

    return returnBook
  },
  // TODO: Expand the following mutation to return something for `bookCount` or wahtever.
  editAuthor: async (root, args, context) => {
    if (Object.keys(context).length === 0) {
    throw new Error("Need to log in.")
    }
    
    const { name, born } = args
    const modifiedAuthor = await Author.findOne({ name: name })
    modifiedAuthor.born = born

    // const books = await Book.find()
    // const bookCount = books.filter( bookItem => bookItem.author.toString() === modifiedAuthor._id.toString() ).length
    // modifiedAuthor.bookCount = bookCount
    modifiedAuthor.save()
    return modifiedAuthor
  },
  createUser: async (root, args) => {
    const { username, favoriteGenre, password} = args
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const createdUser = new User({ username, favoriteGenre, passwordHash })
    await createdUser.save()
    return { username, favoriteGenre, id: createdUser._id.toString() }
  },
  login: async (root, args) => {
    const { username, password } = args
    const userRecord = await User.findOne({ username: username })

    if (userRecord) {
    const match = await bcrypt.compare(password, userRecord.passwordHash)
    if (match) {
      const { username, favoriteGenre } = userRecord
      const token = jwt.sign( { username, favoriteGenre }, TOKEN_SECRET)
      // I suppose this token will be saved in `localstorage` on the part of React
      return { value: token }
    } else {
      throw new Error(`password incorrect`)
    }

    } else {
    throw new Error(`username ${username} not found`)
    }
  }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
  const auth = req ? req.headers.authorization : null
  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), TOKEN_SECRET
    )
    const currentUser = await User.findOne({ username: decodedToken.username } )
    if (currentUser) {
    // console.log(currentUser)
    return { username: currentUser.username,
      favoriteGenre: currentUser.favoriteGenre,
      id: currentUser._id.toString()
    }
    } else {
    throw new Error("User doesn't exist.")
    }
  } else {
    return null
  }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})

