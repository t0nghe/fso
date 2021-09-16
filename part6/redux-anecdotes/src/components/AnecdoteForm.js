// import { useDispatch } from 'react-redux'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = (props) => {

    // const dispatch = useDispatch()

    const createNew = (e) => {
        e.preventDefault()
        const data = e.target.anecdoteContent.value
        e.target.anecdoteContent.value = ''
        props.createAnecdote(data)
      }

    return (<><h2>create new</h2>
        <form onSubmit={createNew}>
          <div><input name='anecdoteContent' /></div>
          <button type='submit'>create</button>
        </form></>)
}

const mapDispatchToProps = {
  createAnecdote
}
const ConnectedAnecdoteForm = connect(null, mapDispatchToProps)(AnecdoteForm)

export default ConnectedAnecdoteForm