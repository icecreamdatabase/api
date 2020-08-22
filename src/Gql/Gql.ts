"use strict"

import express, {Express, NextFunction, Request, Response} from "express"
import {Logger} from "../helper/Logger"
import {Api} from "../Api"

export class Gql {
  private static readonly portREST = 4710
  private readonly _api: Api
  private readonly _app: Express

  constructor (api: Api) {
    this._api = api
    this._app = express()
  }

  public init () {
    //TODO: Better logger. This one logs before having done anything FeelsDankMan
    this.app.use(
      async (req: Request, res: Response, next: NextFunction) => {
        Logger.http(req, res)
        next()
      })

    this.app.listen(Gql.portREST)
    Logger.info("REST listening...")
  }

  private get api (): Api {
    return this._api
  }

  public get app (): Express {
    return this._app
  }

}
