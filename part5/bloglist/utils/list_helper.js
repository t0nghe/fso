const _ = require('lodash')
const testBlogList = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    const count = blogs.reduce(
        (acc, curr) => acc + curr.likes, 0
    )
    return count
}

// ex 4.5
// This function returns the {title author likes} of the most liked blog
// when the input blogs list is empty, null is returned
// Learned: empty arrays are of type `object` hence tests truthy
const favoriteBlog = (blogs) => {
    if (blogs.length > 0) {
    let indexOfMax = 0
    let currMax = 0

    blogs.forEach( (blog, idx) => {
        if (blog.likes > currMax) {
            currMax = blog.likes
            indexOfMax = idx
        }
    } )

    const {title, author, likes} = blogs[indexOfMax]
    return {title, author, likes}
    } else {
        return null
    }
}

// ex 4.6
// returns the author with the most blogs published and the count
// { author: "Name", blogs: 101 }
// if the input `blogs` is empty, null is returned.
// Using lodash does make it a lot easier.
const mostBlogs = (blogs) => {
    if (blogs.length>0) {
        const k = _.countBy(blogs, 'author')
        const l = _.maxBy(Object.keys(k), i=>k[i])
        return {author: l, blogs: k[l]}
    } else {
        return null
    }
}

// ex 4.7
// Lodash is tricky but dexterous. 
const mostLikes = (blogs) => {
    if (blogs.length>0) {
        const k = _(blogs).groupBy('author')
        .mapValues(entries => _.sumBy(entries, 'likes'))
          .map((likes, author) => ({ author, likes }))
          .maxBy('likes')
        return k;
    } else {
        return null
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostLikes,
    mostBlogs
}
