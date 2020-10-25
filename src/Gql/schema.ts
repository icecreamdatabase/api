import typeDefs from './schema/schema'
import {makeExecutableSchema} from 'graphql-tools'
import {PubSub} from 'graphql-subscriptions'
import {ResolverMap} from './resolverMap'
import {GraphQLSchema} from 'graphql'

export class Schema {
  private resolverMap: ResolverMap
  public schema: GraphQLSchema

  constructor (private pubsub: PubSub) {
    this.resolverMap = new ResolverMap(this.pubsub)
    this.schema = makeExecutableSchema({
      typeDefs,
      resolvers: this.resolverMap.resolvers
    })
  }

}

