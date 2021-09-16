const saveToken = (token) => {
  localStorage.setItem("token", token)
}

const retrieveToken = () => {
  const token = localStorage.getItem("token")
  return token
}

const clearToken = () => {
    localStorage.removeItem('token')
}

export { saveToken, retrieveToken, clearToken }