'use strict'
import {Api} from "../../../Api"
import {Request, Response} from "express"

const util = require('util')

export class ChannelPoints {
  private readonly _api: Api
  private readonly _pathBase: string
  private readonly _pathOwn = "channelpoints"

  constructor (api: Api, pathBase: string) {
    this._api = api
    this._pathBase = pathBase
  }

  public init (): void {
    this.api.rest.app.get(this.nextPaths, this.base.bind(this))

  }

  private get api (): Api {
    return this._api
  }

  private get nextPaths (): string {
    return this._pathBase + "/" + this._pathOwn
  }

  private async base (req: Request, res: Response): Promise<void> {
    res.write(`channelpoints Pog\n${util.inspect(this)}`)
    res.end()
  }

}


