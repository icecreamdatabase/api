"use strict"

import express, {Express, NextFunction, Request, Response} from "express"
import {Logger} from "../helper/Logger"
import {Api} from "../Api"
import {buildSchema} from "graphql"
import {graphqlHTTP} from "express-graphql"
import {RateLimit} from "./RateLimit"
import {Authentication} from "./Authentication"
import {HttpException} from "../helper/HttpException"

export interface IApiResponse {
  status: number,
  message?: string,
  data?: any
}

export class Gql {
  private static readonly portREST = 4710
  private readonly _api: Api
  private readonly _app: Express

  private static readonly schema = buildSchema(`
    type Query {
      hello: String
    }
  `)

  private static readonly root = {
    hello: () => {
      return 'Hello world!'
    }
  }


  constructor (api: Api) {
    this._api = api
    this._app = express()

    //TODO: Better logger. This one logs before having done anything FeelsDankMan
    this.app.use(Gql.onLog)
    //this.app.use(express.json())
    this.app.use(Authentication.handle)
    this.app.use(RateLimit.handle)

    this.app.use('/', graphqlHTTP({
      schema: Gql.schema,
      rootValue: Gql.root,
      graphiql: true
    }))

    this.app.use(Gql.errorHandler) // Make sure this is the last use before gets
    this.app.use(Gql.on404) //Make sure this is last ever one

    this.app.listen(Gql.portREST)
    Logger.info("REST listening...")
  }

  private get api (): Api {
    return this._api
  }

  public get app (): Express {
    return this._app
  }

  private static async errorHandler (err: HttpException | Error, req: Request, res: Response, next: NextFunction) {
    if (res.headersSent) {
      return next(err)
    }
    if (err instanceof HttpException) {
      res.status(err.status).json(err.getJson())
    } else {
      res.status(500).json(<IApiResponse>{status: 500, message: err.message})
    }
    res.end()
  }

  private static async onLog (req: Request, res: Response, next: NextFunction) {
    Logger.http(req, res)
    next()
  }

  private static async on404 (req: Request, res: Response) {
    //throw new HttpException(404, "Resource not found")
    res.status(404).json(<IApiResponse>{status: 404, message: "Resource not found"})
  }

}
