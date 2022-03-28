const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

const PORT = 4000

const logs = [{
  timestamp: +new Date(),
  text: "test log"
}]

const typeDefs = gql`
  scalar Date

  type Log {
    timestamp: Date
    text: String
  }

  type Query {
    logs: [Log]
  }

  type Mutation {
    addLog(text: String): Date
  }
`

const resolvers = {
  Query: {
    logs: () => {
      return logs
    }
  },
  Mutation: {
    addLog: (_ , { text }) => {
      const date = +new Date()
      logs.push({
        timestamp: date,
        text: text
      })
      return date
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