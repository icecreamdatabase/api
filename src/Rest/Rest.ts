"use strict"

import util from "util"
import {Authentication} from "../helper/Authentication"
import express, {Express} from "express"
import {HttpException} from "../helper/HttpException"
import {Logger} from "../helper/Logger"

export interface IApiResponse {
  status: number,
  message?: string,
  data?: any
}

export class Rest {
  private static readonly portREST = 4710
  private app: Express

  constructor () {
    this.app = express()


    this.app.use(Rest.auth)
    this.app.use(Rest.errorHandler) // Make sure this is the last use before gets
    this.app.get("/", Rest.onRoot)

    //TODO: add all the api constructors in here

    this.app.use(Rest.on404) //Make sure this is last ever one

    this.app.listen(Rest.portREST)

  }

  private static async errorHandler (err: HttpException | Error, req: express.Request, res: express.Response, next: express.NextFunction) {
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

  private static async auth (req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      await Authentication.check(req, res)
      next()
    } catch (e) {
      next(e)
    }
  }

  private static async on404 (req: express.Request, res: express.Response) {
    //throw new HttpException(404, "Resource not found")
    res.status(404).json(<IApiResponse>{status: 404, message: "Resource not found"})
  }

  private static async onRoot (req: express.Request, res: express.Response) {

    Logger.info("xd")
    res.write(util.inspect(req.params))
    res.end()
  }
}
