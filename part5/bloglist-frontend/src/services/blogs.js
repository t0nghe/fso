import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const postBlog = async (blog, token) => {
  const res = await axios.post(baseUrl, blog, { headers: { 'Authorization': `bearer ${token}` } })
  return res}

export default { getAll, postBlog }