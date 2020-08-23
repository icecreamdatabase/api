"use strict"

import express, {Express, NextFunction, Request, Response} from "express"
import {Logger} from "../helper/Logger"
import {Api} from "../Api"
import "reflect-metadata"
import {buildSchema} from "type-graphql"
import {ApolloServer} from "apollo-server-express"
import {Authentication, IAccessTokenData} from "./Authentication"
import {GraphQLSchema} from "graphql"
import {UserResolver} from "./resolvers/UserResolver"
import {ChannelSettingsResolver} from "./resolvers/ChannelSettingsResolver"
import {ExpressContext} from "apollo-server-express/dist/ApolloServer"

export interface IApiResponse {
  status: number,
  message?: string,
  data?: any
}

export interface IContext extends ExpressContext {
  oAuthData?: IAccessTokenData
}

export class Gql {
  private static readonly portREST = 4710
  private readonly _api: Api
  private readonly _app: Express
  private _schema?: GraphQLSchema
  private _apolloServer?: ApolloServer

  constructor (api: Api) {
    this._api = api
    this._app = express()
  }

  async init () {
    this._schema = await buildSchema({
      resolvers: [UserResolver, ChannelSettingsResolver],
      emitSchemaFile: true,
      validate: false, //TODO: set to true once I'm doing validations
      authChecker: Authentication.authChecker
    })

    if (!this._schema) {
      throw new Error("Schema is undefined")
    }

    this._apolloServer = new ApolloServer({
      schema: this._schema,
      context: async (context: IContext) => ({
        oAuthData: await Authentication.check(context.req, context.res),
        ...context
      }),
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
