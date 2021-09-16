import { configureStore } from '@reduxjs/toolkit'
import messageReducer from './message'
import blogReducer from './blogs'
import userReducer from './user'

const store = configureStore({
  reducer: {
    message: messageReducer,
    blogs: blogReducer,
    user: userReducer
  }
})

export default store