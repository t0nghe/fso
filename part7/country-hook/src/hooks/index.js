import { useEffect, useState } from 'react'
import axios from 'axios'

export const useCountry = (name) => {
  const [country, setCountry] = useState(name)
  const baseUrl = 'https://restcountries.eu/rest/v2/name'

  useEffect(() => {
    (async() => {
      if (name) {
        try {
          const request = await axios.get(`${baseUrl}/${name}?fullText=true`)
          setCountry({
            found: true, data:request.data[0]
          })
        } catch(exception) {
          setCountry({
            found: false, data: ''
          })
        }
      }
    })()},
    [name])

  return country
}

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}
