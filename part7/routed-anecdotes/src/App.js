import React, { useState } from 'react'
import AnecdoteList from './components/AnecdotesList'
import SingleAnecdote from './components/SingleAnecdote'
import About from './components/About'
import Footer from './components/Footer'
import CreateNew from './components/CreateNew'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom"
import { useHistory } from 'react-router-dom'

const App = () => {
  const [allAnecdotes, setAllAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    }
  ])
  const [notification, setNotification] = useState('')
  const history = useHistory()

  const addNew = (anecdote) => {
    console.log('anecdote in `App`', anecdote)
    anecdote.id = (Math.random() * 10000).toFixed(0)
    console.log('anecdote in `App` with id', anecdote)
    // console.log(typeof anecdote.id)
    const newAnecdotes = allAnecdotes.concat(anecdote)
    setAllAnecdotes(newAnecdotes)
    // console.log(`anecdotes after concat`, newAnecdotes)
  }

  const anecdoteById = (id) =>
  allAnecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAllAnecdotes(allAnecdotes.map(a => a.id === id ? voted : a))
  }

  const padding = {
    paddingRight: 5
  }

  return (
      <Router>
      <h1>Software anecdotes</h1>
      <div>
        <Link style={padding} to="/">anecdotes</Link>
        <Link style={padding} to="/create">create new</Link>
        <Link style={padding} to="/about">about</Link>
      </div>

      <Switch>
        <Route path="/anecdotes/:id">
        <SingleAnecdote anecdotes={allAnecdotes} />
        {/* <AnecdoteList anecdotes={allAnecdotes} />  */}
        </Route>
        <Route path="/create">
          <CreateNew addNew={addNew} />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route exact path="/">
          <AnecdoteList anecdotes={allAnecdotes} /> 
        </Route>
      </Switch>

      <Footer />
      </Router>
  )
}

export default App