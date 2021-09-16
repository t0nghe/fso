import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useField } from '../hooks'

const CreateNew = (props) => {
  const [notification, setNotification] = useState('')
  const history = useHistory()
  const contentField = useField('content')
  const authorField = useField('author')
  const infoField = useField('info')
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(e)
    props.addNew({
      content: contentField.value,
      author: authorField.value,
      info: infoField.value,
      votes: 0
    });
    setNotification(`A new anecdote “${contentField.value}” is created.`);
    setTimeout(
      ()=> history.push('/'), 1000
    )
  }

  const resetValues = (e) => {
    e.preventDefault()
    contentField.reset()
    authorField.reset()
    infoField.reset()
  }
    
    if (!notification) {
      return (
        <div>
          <h2>create a new anecdote</h2>
          <form onSubmit={handleSubmit}>
            <div>
              content
              <input name="content" value={contentField.value} type={contentField.type} onChange={contentField.onChange} />
            </div>
            <div>
              author
              <input name="author" value={authorField.value} type={authorField.type} onChange={authorField.onChange} />
            </div>
            <div>
              url for more info
              <input name="info" value={infoField.value} type={infoField.type} onChange={infoField.onChange} />
            </div>
            <button type="submit">create</button>
            <button onClick={resetValues}>reset</button>
          </form>
        </div>
      )
    } else {
      return <div>{notification}</div>
    }
    
  }

export default CreateNew