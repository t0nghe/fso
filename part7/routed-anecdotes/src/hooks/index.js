import { useState } from 'react'

export const useField = (name) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
    console.log('value in the `useField` thingy', value)
  }

  const reset = (event) => {
    setValue('')
  }

  return {
    name,
    type: "text",
    value,
    onChange,
    reset
  }
}