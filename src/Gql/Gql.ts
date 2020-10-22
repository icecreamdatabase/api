"use strict"

import express, {Express, NextFunction, Request, Response} from "express"
import {Logger} from "../helper/Logger"
import {Api} from "../Api"
import {ApolloServer} from "apollo-server-express"
import {Authentication, IAccessTokenData} from "./Authentication"
import {ExpressContext} from "apollo-server-express/dist/ApolloServer"
import schema from "./schema"

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

  constructor (api: Api) {
    this._api = api
    this._app = express()
  }

  async init () {
    this._apolloServer = new ApolloServer({
      schema,
      context: async (context: IContext) => {
        const oAuth = await Authentication.check(context.req, context.res)
        return <IContext>{
          oAuthData: oAuth,
          requesterId: oAuth?.user_id,
          ...context
        }
      },
      debug: true //TODO: read from config
    })

    //TODO: Better logger. This one logs before having done anything FeelsDankMan
    this._app.use(Gql.onLog)

    this._apolloServer.applyMiddleware({app: this._app, path: "/"})

    this._app.listen({port: Gql.portREST})
    Logger.info("REST listening...")
  }

  private static async onLog (req: Request, res: Response, next: NextFunction) {
    Logger.http(req, res)
    next()
  }
}
