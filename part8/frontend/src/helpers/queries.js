import { gql } from '@apollo/client'

export const NEW_BOOK = gql`
mutation AddANewBook($addBookTitle: String!, $addBookAuthor: String!, $addBookPublished: Int!, $addBookGenres: [String!]!) {
  addBook(title: $addBookTitle, author: $addBookAuthor, published: $addBookPublished, genres: $addBookGenres) {
    title
    author {
      name
    }
    published
    genres
  }
}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}
`

export const ALL_BOOKS = gql`
query {
  allBooks {
    title
    author {
      name
    }
    published
    genres
  }
}
`

export const EDIT_AUTHOR_AGE = gql`
mutation ChangeAuthorAge($authorName: String!, $newBirthYear: Int!) {
  editAuthor(
    name: $authorName,
    born: $newBirthYear
  ) {
    name
    born
  }
}
`

export const LOGIN = gql`
mutation LoginMutation($loginUsername: String!, $loginPassword: String!) {
  login(username: $loginUsername, password: $loginPassword) {
    value
  }
}
`

export const ME = gql`
query Query {
  me {
    username
    favoriteGenre
    id
  }
}
`

export const BOOKS_BY_GENRE = gql`
query Query($allBooksGenre: String) {
  allBooks(genre: $allBooksGenre) {
    title
    author {
      name
    }
    published
  }
}
`