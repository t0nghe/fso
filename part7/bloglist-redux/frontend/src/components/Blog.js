import React from 'react'

const Blog = ({ blog, likeThis, deleteThis }) => (
  <div className="ex5x13">
    {blog.title} <em>{blog.author}</em> • {blog.likes} • <button onClick={likeThis}>like</button> • <button onClick={deleteThis}>delete</button>
  </div>
)

export default Blog