"use strict"

import util from "util"
import {Authentication} from "../helper/Authentication"
import express, {Express, NextFunction, Request, Response} from "express"
import {HttpException} from "../helper/HttpException"
import {Logger} from "../helper/Logger"
import {Api} from "../Api"
import {V1} from "./v1/V1"

export interface IApiResponse {
  status: number,
  message?: string,
  data?: any
}

export class Rest {
  private static readonly portREST = 4710
  private readonly _pathBase = ""
  private readonly _app: Express
  private readonly _v1: V1
  private readonly _api: Api

  constructor (api: Api) {
    this._api = api
    this._app = express()

    this._v1 = new V1(this.api, this.nextPaths)
  }

  public init () {
    this.app.use(Rest.onLog)
    this.app.use(Rest.auth)
    this.app.use(Rest.errorHandler) // Make sure this is the last use before gets
    this.app.get("/", this.base.bind(this))

    //TODO: add all the api inits in here
    this._v1.init()

    this.app.use(Rest.on404) //Make sure this is last ever one

    this.app.listen(Rest.portREST)
    Logger.info("REST listening...")
  }

  private get api (): Api {
    return this._api
  }

  private get nextPaths (): string {
    return this._pathBase
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

  private static async auth (req: Request, res: Response, next: NextFunction) {
    try {
      req.oAuthData = await Authentication.check(req, res)
      next()
    } catch (e) {
      next(e)
    }
  }

  private static async onLog (req: Request, res: Response, next: NextFunction) {
    Logger.http(req, res)
    next()
  }

  private static async on404 (req: Request, res: Response) {
    //throw new HttpException(404, "Resource not found")
    res.status(404).json(<IApiResponse>{status: 404, message: "Resource not found"})
  }

  private async base (req: Request, res: Response) {

    res.write(util.inspect(req.params))
    res.end()
  }
}
