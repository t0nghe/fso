import React, { useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { saveToken } from '../helpers/localstorage'
import { LOGIN, ME } from '../helpers/queries'

const LoginForm = (props) => {
  // const [returnedToken, setReturnedToken] = useState('')
  const setUser = props.setUser
  // const setPage = props.setPage
  const getUser = useQuery(ME)
  const [login, loginResult] = useMutation(LOGIN, {
    onError: (error) => {
      throw new Error(error.graphQLErrors[0].message)
    }
  })

  const loginMutation = async (e) => {
    e.preventDefault()
    login({variables:
      { loginUsername: e.target.username.value,
      loginPassword: e.target.password.value }
    })
  }

  useEffect(() => {
    if ( loginResult.data ) {
      const token = loginResult.data.login.value
      // console.log(token)
      saveToken(token)
      // setReturnedToken(token)
    }
  }, [loginResult.data]) // eslint-disable-line

  useEffect(() => {
    if (!getUser.loading && getUser.data) {
      // console.log('getUser.data', getUser.data)
      setUser(getUser.data.me)
    } else {
      setUser(null)
    }
  }, [getUser.loading])  // eslint-disable-line

  if (!props.show) {
    return null
  }

  return <div><form onSubmit={loginMutation}>
    <label>Username: <input id="username" type="text"></input></label><br />
    <label>Password: <input id="password" type="password"></input></label><br />
    <button type="submit">log in</button>
    </form>
    </div>
}

export default LoginForm