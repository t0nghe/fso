import { createSlice } from '@reduxjs/toolkit'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: { value: [] },
  reducers: {
    // 210906:
    // action.payload should be a list of
    // all blogs.
    initPosts: (state, action) => {
      state.value = action.payload
      // console.log('inside reducer: payload', action.payload)
      // console.log('inside reducer: state', state.value)
    },
    // 210906:
    // action.payload should be the id of a blog post to be deleted.
    // Note: This part of the projecct only takes care of updating Redux store.
    // And does not take care of Axios.
    deletePost: (state, action) => {
      state.value = state.value.filter(item => item.id !== action.payload)
    },
    // 210906:
    // It seems easier not to implement liking a post, but to implement its superset.
    modifyPost: (state, action) => {
      const id = action.payload.id
      const stateMinusOne = state.value.filter(item => item.id !== id)
      state.value = stateMinusOne.concat(action.payload)
    }
  }
})

export const { initPosts, deletePost, modifyPost } = blogSlice.actions

export default blogSlice.reducer