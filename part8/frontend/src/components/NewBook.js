import { useMutation } from '@apollo/client'
import { NEW_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../helpers/queries'
import React, { useState } from 'react'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [createNewBook] = useMutation(NEW_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS, ALL_AUTHORS }],
    onError: (error) => {
      console.log(JSON.stringify(error, null, 2))
    },
    update: (store, response) => {
      const dataInStore = store.readQuery({query: ALL_BOOKS})
      store.writeQuery({
        query: ALL_BOOKS,
        data: {
          ...dataInStore,
          allBooks: [
            ...dataInStore.allBooks, response.data.addBook
          ]
        }
      })
    }
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    createNewBook({variables: {
      addBookTitle: title,
      addBookAuthor: author,
      addBookPublished: parseInt(published),
      addBookGenres: genres
    }}).then(
      () => {
      setTitle('')
      setAuthor('')
      setPublished('')
      setGenre('')
      setGenres([])
    }
    )
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  if (props.user) {
    return (
      <div>
        <form onSubmit={submit}>
          <div>
            title
            <input
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </div>
          <div>
            author
            <input
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            published
            <input
              type='number'
              value={published}
              onChange={({ target }) => setPublished(target.value)}
            />
          </div>
          <div>
            <input
              value={genre}
              onChange={({ target }) => setGenre(target.value)}
            />
            <button onClick={addGenre} type="button">add genre</button>
          </div>
          <div>
            genres: {genres.join(' ')}
          </div>
          <button type='submit'>create book</button>
        </form>
      </div>
    )
  } else {
    return <div><hr />You need to log in before adding a new book.</div>
  }
}

export default NewBook