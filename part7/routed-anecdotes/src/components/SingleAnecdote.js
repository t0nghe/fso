import { useParams } from 'react-router-dom'

const SingleAnecdote = ({ anecdotes }) => {
    const id=useParams().id

    console.log('SingleAnecdote anecdotes', anecdotes)
    const selected = anecdotes.find( item => item.id===id)

    return <div>
        <h2>{selected.content} <em>by</em> {selected.author}</h2>
        <p>This quote has {selected.votes} vote(s).</p>
        <p>Read more about this quote at: <a href={selected.info}>{selected.info}</a></p>
    </div>
}

export default SingleAnecdote
