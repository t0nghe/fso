import { React, useState } from 'react'

const CreateNewBlog = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const clickHandler = (event) => {
    event.preventDefault()
    props.createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return <><h2>create new</h2>
    <form>
      <lable>title: <input id='blogTitle' value={title} onChange={({ target }) => {setTitle(target.value)}}></input></lable><br/>
      <lable>author: <input id='blogAuthor' value={author} onChange={({ target }) => {setAuthor(target.value)}}></input></lable><br/>
      <lable>url: <input id='blogUrl' value={url} onChange={({ target }) => {setUrl(target.value)}}></input></lable><br/>
      <button id='blogCreate' onClick={clickHandler}>create</button>
    </form>
  </>
}

export default CreateNewBlog