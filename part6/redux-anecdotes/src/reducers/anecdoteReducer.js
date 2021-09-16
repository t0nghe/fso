import axios from 'axios'

const anecdotesAtStart = [
  ''
]

// Clever way to generate an ID.
const getId = () => (100000 * Math.random()).toFixed(0)

export const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

export const anecdoteReducer = (state = initialState, action) => {
  // console.log(state)
  const objId = action.id
  switch (action.type) {
    case "VOTE":
      const newObj = state.filter(item=>item.id===objId)[0]
      // console.log('filtered newObj', newObj)
      newObj.votes = newObj.votes +1;
      // console.log('newObj with one added vote', newObj)
      const newState = state.filter(item=>item.id!==objId)
      newState.push(newObj)
      newState.sort((a,b)=>{return b.votes-a.votes})
      return newState
    case "NEW_ANEC":
      // console.log(action.data)
      const newState1 = state.concat(action.data)
      // newState1.sort((a,b)=>{return b.votes-a.votes})
      return newState1
    case "INIT":
      console.log('INIT action', action)
      return action.collection
    default:
      return state
  }

}

export const createAnecdote = (text) => {
  // console.log('createAnecdote, text', text)
  const myObj = asObject(text)
  // console.log('createAnecdote, myObj', myObj)
  return async (dispatch) => {
    const res =  await axios.post('http://localhost:3001/anecdotes/', myObj)
    // console.log('async dispatch: res', res)
    dispatch(
      { type: 'NEW_ANEC', data: res.data }
    )
  }
}

export const voteForAnecdote = (anecdote) => {
  const id = anecdote.id
  const newAnecdoteStatus = {...anecdote, votes: anecdote.votes+1}
  // console.log('newAnecdoteStatus', newAnecdoteStatus)
  return async (dispatch) => {
    await axios.put(`http://localhost:3001/anecdotes/${id}`, newAnecdoteStatus)
    // console.log('async put', res)
    dispatch(
      { type: "VOTE", id }
    )
  }
}

export const initAnecdotes = () => {
  return async dispatch => {
    const res = await axios.get('http://localhost:3001/anecdotes')
    const collection = res.data
    dispatch(
      {type: 'INIT', collection}
    )
  }
}