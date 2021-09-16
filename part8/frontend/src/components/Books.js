import { useLazyQuery } from '@apollo/client'
import React, { useState, useEffect } from 'react'
import { ALL_BOOKS } from '../helpers/queries'

const Books = (props) => {
  const [getAllBooks, result] = useLazyQuery(ALL_BOOKS)
  const [genre, setGenre] = useState('')

  useEffect(
    ()=>{
      getAllBooks()
    }, [genre] // eslint-disable-line
  )

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <>loading</>
  }

  const books = result.data.allBooks
  const reducedBooks = books.reduce(
    (a, b) => {
      const genA = a.genres
      const genB = b.genres
      return { genres: [...genA, ...genB] }
    }, { genres: [] }
  )
  const allGenres = Array.from(new Set(reducedBooks.genres))

  const filteredBooks = (!genre) ? books : books.filter(
    item => item.genres.includes(genre)
  )

  return (
    <div>
      <h2>books</h2>
      <div>
        <button onClick={()=>setGenre('')}>all</button>
        {allGenres.map(item=>{
          return <button key={item} onClick={()=>setGenre(item)}>{item}</button>
        })}
      </div>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {filteredBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books