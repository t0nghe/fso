import { createSlice } from '@reduxjs/toolkit'

// The entire state of this application includes:
// - blogs; - user; -message (which is basically notification)
const messageSlice = createSlice({
  name: 'message',
  initialState: { value: ['', 'nomsg'] }, // Thus the initial state is an array
  reducers: {
    // Redux Toolkit allows us to write 'mutating' logic.
    // Now action.payload only needs to be a string!
    msgBad: (state, action) => {
      state.value = [action.payload, 'bad']
    },
    msgGood: (state, action) => {
      state.value = [action.payload, 'good']
    },
    msgClear: state => {
      // eslint-disable-next-line no-unused-vars
      state.value = ['', 'nomsg']
    },
  },
})

const msgClearAsync = () => dispatch => {
  setTimeout(() => {
    dispatch(msgClear())
  }, 3000)
}

const { msgBad, msgGood, msgClear } = messageSlice.actions

export { msgBad, msgGood, msgClear, msgClearAsync }

// Note!
// As shown above, whateverSlice.actions
// is a property available in the returned object from `createSlice()`,
// this reducer property is also that.
// It's different from `reducers` key before creating the object (line 8).
export default messageSlice.reducer

