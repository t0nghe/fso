const userA = { username: "usera", name: "User Alpha", passwordHash: "$2b$11$OoP7aXNFLeMhhARzMvRY5.msCP7QrQaqk2LScK.ffQkR36ZY.usBK" }

const userB = { username: "userb", name: "User Beta", passwordHash: "$2b$11$4mLolku6mYx4MJzG3Br/buQUxRsMx8pBIwttxabsk.kMopRqf2iV6" }

const numUsers = 2

const initBlogsByA = [
  { title: "First Blog by User Alpha", author: "User Alpha", url: "http://user.alpha/01" }, 
  { title: "Second Blog by User Alpha", author: "User Alpha", url: "http://user.alpha/02" }
]

const initBlogsByB = [
  { title: "Le Permier Blog par User Beta", author: "User Beta", url : "http://user.beta/01" },
  { title:"Le Secondaire Blog par User Beta", author:"User Beta", url : "http://user.beta/02"}
]

const testBlogs = {
  blogPostValid : {
      title: "Testing Blog Post",
      author: "Supertest",
      url: "http://superte.st/001",
      likes: 2
  },
  blogPostNoTitle: {
      author: "Supertest",
      url: "http://superte.st/001",
      likes: 2
  },
  blogPostNoUrl: {
      title: "Testing Blog Post",
      author: "Supertest",
      likes: 2
  }, 
  blogPostNoLikes: {
      title: "Testing Blog Post",
      author: "Supertest",
      url: "http://superte.st/001"
  }
}

const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXJhIiwiaWQiOiI2MGRmOTg5ZTZiN2RhOTZhODg3OTZkYzkiLCJpYXQiOjE2MjUyNjYzNTB9.onFwaupcbY0nspHfk8dpKbAV5knvr47XNT0WKdahbXg"

const numBlogs = initBlogsByA.length + initBlogsByB.length 

module.exports = {
  userA, userB, initBlogsByA, initBlogsByB, numUsers, numBlogs, testBlogs, invalidToken
}