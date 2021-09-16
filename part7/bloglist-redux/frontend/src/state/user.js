import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: { value: null },
  reducers: {
    successLogin: (state, action) => {
      state.value = action.payload
    }
  }
})

export const { successLogin } = userSlice.actions

export default userSlice.reducer