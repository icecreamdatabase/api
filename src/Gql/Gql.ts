"use strict"

import express, {Express, NextFunction, Request, Response} from "express"
import {Logger} from "../helper/Logger"
import {Api} from "../Api"
import {ApolloServer} from "apollo-server-express"
import {Authentication, IAccessTokenData} from "./Authentication"
import {ExpressContext} from "apollo-server-express/dist/ApolloServer"
import {Schema} from "./schema"
import {PubSub} from 'graphql-subscriptions'
import {SubscriptionServer} from 'subscriptions-transport-ws'
import {createServer} from "http"
import {execute, subscribe} from "graphql"
import bodyParser from 'body-parser'

export interface IApiResponse {
  status: number,
  message?: string,
  data?: any
}

export interface IContext extends ExpressContext {
  oAuthData?: IAccessTokenData
  requesterId?: string
}

export class Gql {
  private static readonly portREST = 4710
  private readonly _api: Api
  private readonly _app: Express
  private _apolloServer?: ApolloServer
  private readonly _pubsub: PubSub
  private _schema: Schema

  constructor (api: Api) {
    this._api = api
    this._app = express()
    this._pubsub = new PubSub()
    this._schema = new Schema(this._pubsub)
  }

  async init () {
    this._apolloServer = new ApolloServer({
      schema: this._schema.schema,
      context: async (context: IContext) => {
        const oAuth = await Authentication.check(context.req, context.res)
        return <IContext>{
          oAuthData: oAuth,
          requesterId: oAuth?.user_id,
          ...context
        }
      },
      subscriptions: {
        path: "/"
      },
      //TODO: read the next 3 lines from config / env var
      playground: true,
      tracing: true,
      debug: true
    })
    this._app.use('/', bodyParser.json())

    this._app.use(Gql.onLog)

    this._apolloServer.applyMiddleware({app: this._app, path: "/"})

    const server = createServer(this._app)

    server.listen(Gql.portREST, () => {
      new SubscriptionServer({
        execute,
        subscribe,
        schema: this._schema.schema
      }, {
        server,
        path: '/'
      })
    })
    Logger.info("REST listening...")
  }

  private static async onLog (req: Request, res: Response, next: NextFunction) {
    Logger.http(req, res)
    next()
  }
}
