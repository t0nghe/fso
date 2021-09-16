import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import CreateNewBlog from './components/CreateNewBlog'
import Togglable from './components/Toggle'
import { useSelector, useDispatch } from 'react-redux'
import { msgBad, msgGood, msgClearAsync } from './state/message'
import { initPosts, deletePost, modifyPost } from './state/blogs'
import { successLogin } from './state/user'

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

const App = () => {
  // const [blogs, setBlogs] = useState([])
  // const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [message, setMessage] = useState([])
  const dispatch = useDispatch()
  const message = useSelector( (state) => state.message.value )
  const user = useSelector( (state) => state.user.value )

  const creatingBlogRef = useRef()

  useEffect(
    () => {
      const loggedInUser = window.localStorage.getItem('loggedInUser')
      if (loggedInUser) {
        dispatch(successLogin(JSON.parse(loggedInUser)))
      }
      blogService.getAll().then(
        res => {
          console.log(res)
          dispatch(initPosts(res))
        }
        // res => setBlogs(res)
      ).catch( () => {
        dispatch(msgBad('Error'))
        dispatch(msgClearAsync())
      })
    },
    []
  )

  const blogs = useSelector( state => state.blogs.value )
  console.log(blogs)

  const handleClickLogin = async (event) => {
    event.preventDefault()
    try {
      const res = await loginService.userLogin( { username, password } )
      window.localStorage.setItem('loggedInUser', JSON.stringify(res))
      dispatch(successLogin(res))
    } catch (err) {
      dispatch(msgBad('Login Failed.'))
      dispatch(msgClearAsync())
    }
  }

  const likeBlog = async (blog) => {
    const updatedBlog = { ...blog }
    updatedBlog.likes ++
    try {
      const res = await blogService.modifyBlog(blog.id, { likes: blog.likes +1 }, user.token)
      dispatch(modifyPost(updatedBlog))
      console.log(res)
    } catch (err) {
      dispatch(msgBad(`${err}`))
      dispatch(msgClearAsync())
    }
  }

  const deleteBlog = async (blogId) => {

    blogService.deleteBlog(blogId, user.token).then(dispatch(deletePost(blogId))).catch(
      err => {
        dispatch(msgBad(`${err}`))
        dispatch(msgClearAsync())
      }
    )
  }

  const createBlog = async (blog) => {
    creatingBlogRef.current.toggleVisibility()
    // console.log('We should create this blog!', blog)
    // const res = await blogService.postBlog(blog, user.token)
    // console.log(res.data)
    try {
      const res = await blogService.postBlog(blog, user.token)
      dispatch(msgGood(`${res.data.title} is created`))
      dispatch(msgClearAsync())
    } catch (err) {
      dispatch(msgBad(`${err}`))
      dispatch(msgClearAsync())
    }
  }

  const userLogOut = () => {
    window.localStorage.removeItem('loggedInUser')
    dispatch(successLogin(null))
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
        <Blog key={blog.id} blog={blog} likeThis={() => likeBlog(blog)} deleteThis={() => deleteBlog(blog.id) } />
      )}
    </div>
  </div>)

  return <div>
    <Message message={message} />

    <div>{user===null?loginForm():blogList()}</div>
  </div>
}

export default App