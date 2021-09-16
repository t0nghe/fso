import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState([0,0,0,0,0,0])

  const genRandom = (len) => {
    const newNum = Math.floor(Math.random()*len)
    // console.log(newNum, len)
    setSelected(newNum)
  }

  const voteQuote = (idx) => {
    const newArr = Array.from(votes)
    newArr[idx] += 1
    setVotes(newArr)
    // console.log(newArr)
  }

  let highest = votes.indexOf(Math.max(...votes))

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <div className="anecText">{anecdotes[selected]}</div>
      <div className="voteCount">has {votes[selected]} votes</div>
      <button onClick={()=>voteQuote(selected)}>vote</button>
      <button onClick={()=>genRandom(anecdotes.length)}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <div className="anecText">{anecdotes[highest]}</div>
      <div className="voteCount">has {Math.max(...votes)} votes</div>
    </div>
  )
}

export default App 