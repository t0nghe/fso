import { useLazyQuery } from '@apollo/client'
import { BOOKS_BY_GENRE } from '../helpers/queries'
import React, { useState, useEffect } from 'react'

const Recommend = (props) => {
  const [getByGenre, {loading, data}] = useLazyQuery(BOOKS_BY_GENRE)
  const [recBooks, setRecBooks] = useState(null)

  let username = ''
  let favGenre = ''
  if (props.user) {
    username = props.user.username
    favGenre = props.user.favoriteGenre
  }

  // console.log('username, favGenre', username, favGenre)
  useEffect( ()=> {
    if (username && favGenre) {
      // console.log('useEffect fired')
      getByGenre({variables: { allBooksGenre: favGenre }})
    }
    }, [username, favGenre]) //eslint-disable-line

  useEffect( ()=> {
    if (data) {
      // console.log('loaded data from "useEffect"', data.allBooks)
      setRecBooks(data.allBooks)
    }
  }, [loading, data])

  if (!props.show) {
      return null
  }

  console.log('recBooks', recBooks)
  const bookList = (!recBooks) ? <tr><td>No recommendation for you, my friend!</td></tr> : recBooks.map(item=> {
    return <tr><td>{item.title}</td><td>{item.author.name}</td><td>{item.published}</td></tr> })
  
  return <><div>Here are some recommended <strong>{favGenre}</strong> books for <strong>{username}</strong></div>
  <table><tr><th>Title</th><th>Author</th><th>Published In</th></tr>{bookList}</table>
  </>
}

export default Recommend