import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import CreateNewBlog from './components/CreateNewBlog'
import Togglable from './components/Toggle'
import PropTypes from 'prop-types'

const Message = (props) => {
  const [text, style] = props.message

  const bad = {
    color: 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const good = {
    color: 'green',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  const nomsg = {
    display: 'none'
  }

  switch (style) {
  case 'good':
    return <div style={good}>{text}</div>
  case 'bad':
    return <div style={bad}>{text}</div>
  case 'nomsg':
    return <div style={nomsg}>{text}</div>
  default:
    return <></>
  }
}

Message.propTypes = {
  message: PropTypes.array.isRequired
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState([])

  const creatingBlogRef = useRef()

  useEffect(
    () => {
      const loggedInUser = window.localStorage.getItem('loggedInUser')
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser))
      }
      blogService.getAll().then(
        res => setBlogs(res)
      ).catch( () => {
        setMessage(['Error', 'bad'])
      })
    },
    []
  )

  const handleClickLogin = async (event) => {
    event.preventDefault()
    try {
      const res = await loginService.userLogin( { username, password } )
      window.localStorage.setItem('loggedInUser', JSON.stringify(res))
      setUser(res)
    } catch (err) {
      // console.error(err)
      setMessage(['Login Failed.', 'bad'])
      setTimeout(() => {
        setMessage(['', 'nomsg'])
      }, 5000)
    }
  }

  const createBlog = async (blog) => {
    creatingBlogRef.current.toggleVisibility()
    // console.log('We should create this blog!', blog)
    // const res = await blogService.postBlog(blog, user.token)
    // console.log(res.data)
    try {
      const res = await blogService.postBlog(blog, user.token)
      setMessage([`${res.data.title} is created`, 'good'])
      // If we were not as lazy, we should query for this single blog post using its ID before concatinating.
      // setBlogs(blogs.concat(res.data))
      setTimeout(() => {
        setMessage(['', 'nomsg'])
      }, 5000)
    } catch (err) {
      setMessage([`${err}`, 'bad'])
      setTimeout(() => {
        setMessage(['', 'nomsg'])
      }, 5000)
    }
  }

  const userLogOut = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const loginForm = () => (<><h1>Login to application</h1>
    <form id='loginForm'>
      <label>username: <input id='loginUsername' type='text' onChange={({ target }) => {setUsername(target.value)}}></input></label><br/>
      <label>password: <input type='password' onChange={({ target }) => {setPassword(target.value)}} id='loginPassword'></input></label><br/>
      <button id="loginButton" onClick={handleClickLogin}>Login</button>
    </form></>
  )

  const blogList = () => (<div>
    <h2>blogs</h2>
    <p>{user.name} logged in. <button onClick={userLogOut}>Log Out</button></p>
    <Togglable buttonLabel='create a blog' ref={creatingBlogRef}>
      <CreateNewBlog createBlog={createBlog} />
    </Togglable>
    <div id='listOfBlogs'>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  </div>)

  return <div>
    <Message message={message} />
    {/* <Message message={{'hello': 123}} /> */}
    <div>{user===null?loginForm():blogList()}</div>
  </div>
}

export default App