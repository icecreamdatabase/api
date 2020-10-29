import {IResolvers} from 'graphql-tools'
import {PubSub, withFilter} from 'graphql-subscriptions'
import {Logger} from "../helper/Logger"

export class ResolverMap {
  constructor (private _pubsub: PubSub) {
  }

  public resolvers: IResolvers = {

    Query: {
      helloWorld (_: void, args: void): string {
        return `👋 Hello world! 👋`
      },
      test: async (parent, args, context, info) => {
        await this._pubsub.publish('commentAdded', {commentAdded: {id: 1, content: 'Hello!'}})
        return `test`
      }
    },
    Subscription: {
      commentAdded: {
        subscribe: withFilter(() => this._pubsub.asyncIterator('commentAdded'), (payload /*from pubsub.publish*/, args /*from subscription gql parameters*/) => {
          Logger.info(payload, true)
          Logger.info(args, true)
          return true
        })
      }
    }
  }
}

