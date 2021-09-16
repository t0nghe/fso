import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token")
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})
const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
})

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true
  }
})

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return (
      def.kind === 'OperationDefinition' && def.operation === "subscription"
    )
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: splitLink
  })

ReactDOM.render(<ApolloProvider client={client}><App clearCache={client.resetStore} client={client} /></ApolloProvider>, document.getElementById('root'))