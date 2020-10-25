// language=GraphQL
const schema = `
  
type Query {
  helloWorld: String!
  test: String!
}

type Comment {
  id: String
  content: String
}

type Subscription {
  commentAdded(repoFullName: String!): Comment
}

schema {
  query: Query
  subscription: Subscription
}
`

export default schema
