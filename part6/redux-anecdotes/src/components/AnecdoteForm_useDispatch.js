import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {

    const dispatch = useDispatch()

    const createNew = (e) => {
        e.preventDefault()
        const data = e.target.anecdoteContent.value
        e.target.anecdoteContent.value = ''
        dispatch(createAnecdote(data))
      }

    return (<><h2>create new</h2>
        <form onSubmit={createNew}>
          <div><input name='anecdoteContent' /></div>
          <button type='submit'>create</button>
        </form></>)
}

export default AnecdoteForm