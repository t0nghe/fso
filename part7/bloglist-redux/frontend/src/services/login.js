import axios from 'axios'
const baseUrl = '/api/login'

const userLogin = async (credentials) => {
  // console.log('userLogin:', credentials)
  // Error handling could be improve here.
  const res = await axios.post(baseUrl, credentials)
  console.log('login.js', res)
  return res.data
}

export default { userLogin }