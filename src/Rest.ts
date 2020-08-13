"use strict"

import http, {IncomingMessage, Server, ServerResponse} from "http"
import {Logger} from "./helper/Logger"
import {Authentication, ICheckReturn} from "./helper/Authentication"
import {Method} from "axios"

export interface IApiResponse {
  status: number,
  message?: string,
  data?: any
}


export class Rest {
  private static readonly portREST = 4710
  private server: Server

  constructor () {
    this.server = http.createServer(Rest.onMessage)

    this.server.listen(Rest.portREST)
  }

  private static async onMessage (req: IncomingMessage, res: ServerResponse): Promise<void> {
    res.setHeader("Content-Type", "application/json")
    const {data, accessTokenData}: ICheckReturn = await Authentication.check(req, res)

    if (data.status === 200) {
      switch (<Method>req.method) {
        case "GET":
          break
        case "POST":
          break
        case "PUT":
          break
        case "HEAD":
          // This one is required to not return 405. Now we simply return the basic auth based response.
          break
        default:
          //Method not allowed
          data.status = 405
          data.message = "Method not allowed."
          data.data = undefined
      }
    }

    res.statusCode = data.status
    res.write(JSON.stringify(data, undefined, 2))
    Logger.http(req, res)
    res.end()
  }
}
