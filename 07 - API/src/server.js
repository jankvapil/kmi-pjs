const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

const PORT = 4000

const typeDefs = gql`
  type Query {
    hello: String
  }
`

const resolvers = {
  Query: {
    hello: () => {
      return "Hello"
    }
  }
}

const run = async () => {
  const app = express()
  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  await server.start()
  server.applyMiddleware({ app: app })
  app.listen(PORT, console.log(`GraphQL API is running at http://localhost:${PORT}/graphql`))
}

run()