import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommend from './components/Recommend'
import { useSubscription } from '@apollo/client'
import { BOOK_ADDED, ALL_BOOKS } from './helpers/queries'
import { clearToken } from './helpers/localstorage'

const App = (props) => {
  const client = props.client
  const [page, setPage] = useState('authors')
  const [user, setUser] = useState(null)

  const logout = () => {
    setUser(null)
    clearToken()
    props.clearCache()
    setPage('authors')
  }

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => set.map(item => item.title).includes(object.title)

    const dataInStore = client.readQuery({ query: ALL_BOOKS})

    if (!includedIn(dataInStore.allBooks, addedBook)) {
      // console.log('addedBook', addedBook)
      client.writeQuery({
        query: ALL_BOOKS,
        data: {
          allBooks: dataInStore.allBooks.concat( addedBook )
        }
      })
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ( { subscriptionData }) => {
      // console.log( 'subscriptionData', subscriptionData )
      updateCacheWith( subscriptionData.data.bookAdded )
    }
  })

  useEffect( ()=> {
    setPage('authors')
  }, [user]) // eslint-disable-line
  
  const recButton = (user) ? <button onClick={() => setPage('recommend')}>recommendation</button> : null

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {recButton}
        <button onClick={() => setPage('add')}>add book</button>
        {user?user.username:''}
        {user?<button onClick={()=>logout()}>log out</button>:<button onClick={() => setPage('login')}>login</button>}
      </div>

      <Authors
        show={page === 'authors'} user={user}
      />

      <Books
        show={page === 'books'} user={user}
      />

      <Recommend
        show={page === 'recommend'} user={user}
      />

      <NewBook
        show={page === 'add'} user={user}
      />

      <LoginForm show={page==='login'} setUser={setUser} />
      
    </div>
  )
}

export default App