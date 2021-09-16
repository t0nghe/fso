import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR_AGE } from '../helpers/queries'
import { SetBirthYear } from '../components/SetBirthYear'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [editAuthorAge] = useMutation(EDIT_AUTHOR_AGE, { refetchQueries: [{ query: ALL_AUTHORS} ],
    onError: (error)=>{
      console.log(JSON.stringify(error, null, 2))
    }
  })

  const setNewAage = (input) => {
    const [name, year] = input
    editAuthorAge({variables: {
      authorName: name,
      newBirthYear: year
    }})
  }

  if (!props.show) {
    return null
  }

  if (result.loading) {
    return <>loading</>
  }
  
  const authors = result.data.allAuthors
  // console.log(authors)

  const IfSetBirthYear = (props.user)? <SetBirthYear handleSubmit={setNewAage} allAuthors={authors} /> : <div>You need to log in to set the birth year of an author.</div>

    return (
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                born
              </th>
              <th>
                books.
              </th>
            </tr>
            {authors.map(a =>
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            )}
          </tbody>
        </table>
        <hr/>
        {IfSetBirthYear}
      </div>
    )
  }

export default Authors
