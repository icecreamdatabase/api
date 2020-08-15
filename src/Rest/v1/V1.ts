'use strict'
import {Api} from "../../Api"
import {ChannelPoints} from "./channelpoints/ChannelPoints"
import {Request, Response} from "express"
import util from "util"

export class V1 {
  private readonly _api: Api
  private readonly _pathBase: string
  private readonly _pathOwn = "v1"
  private readonly _channelPoints: ChannelPoints

  constructor (api: Api, pathBase: string) {
    this._api = api
    this._pathBase = pathBase


    this._channelPoints = new ChannelPoints(this.api, this.nextPaths)
  }

  public init (): void {
    this.api.rest.app.get(this.nextPaths, this.base.bind(this))

    this.channelPoints.init()
  }

  private get api (): Api {
    return this._api
  }

  private get nextPaths (): string {
    return this._pathBase + "/" + this._pathOwn
  }

  private get channelPoints (): ChannelPoints {
    return this._channelPoints
  }

  private async base (req: Request, res: Response): Promise<void> {
    res.write(`v1 Pog\n${util.inspect(this)}`)
    res.end()
  }
}


