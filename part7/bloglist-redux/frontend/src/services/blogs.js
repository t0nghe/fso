import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const postBlog = async (blog, token) => {
  const res = await axios.post(baseUrl, blog, { headers: { 'Authorization': `bearer ${token}` } })
  return res}

// TODO
// expand these two methods to work with state/blogs.js
// blog is the entire content of a blog post
const modifyBlog = async (id, updatedBlog, token) => {
  console.log('inside: modifyBlog', id)
  const reqUrl = `${baseUrl}/${id}`
  const res = await axios.put(reqUrl, updatedBlog, { headers: { 'Authorization': `bearer ${token}` } })
  return res
}

const deleteBlog = async (id, token) => {
  const reqUrl = `${baseUrl}/${id}`
  // console.log(id, token)
  const res = await axios.delete(reqUrl, { headers: { 'Authorization': `bearer ${token}` } })
  return res
}

export default { getAll, postBlog, modifyBlog, deleteBlog }