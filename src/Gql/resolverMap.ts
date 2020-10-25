import {IResolvers} from 'graphql-tools'
import {PubSub} from 'graphql-subscriptions'

export class ResolverMap {
  constructor (private _pubsub: PubSub) {
  }
  public resolvers: IResolvers = {

    Query: {
      helloWorld (_: void, args: void): string {
        return `👋 Hello world! 👋`
      },
      test: async (_: any, args: any) => {
        await this._pubsub.publish('commentAdded', {commentAdded: {id: 1, content: 'Hello!'}})
        return `test`
      },
    },
    Subscription: {
      commentAdded: {
        subscribe: () => this._pubsub.asyncIterator('commentAdded')
      }
    }
  }
}

