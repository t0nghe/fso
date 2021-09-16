import React from 'react'

const Blog = ({ blog }) => (
  <div className="ex5x13">
    {blog.title} {blog.author}
  </div>
)

export default Blog