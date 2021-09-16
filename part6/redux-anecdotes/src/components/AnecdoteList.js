import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteForAnecdote, initAnecdotes } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {

    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
    const dispatch = useDispatch()

    useEffect(
      () => {
        dispatch(initAnecdotes())
      }, []
    )
  
    const vote = (anecdote) => {
      dispatch(setNotification(`You've voted for anecdote ${anecdote.id}!`, 5))
      dispatch(voteForAnecdote(anecdote))
    }

    return (<><h2>Anecdotes</h2>
    {anecdotes.filter( anecdote=> anecdote.content.indexOf(filter)!==-1).map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote)}>vote</button>
        </div>
      </div>
    )}</>)
}

export default AnecdoteList