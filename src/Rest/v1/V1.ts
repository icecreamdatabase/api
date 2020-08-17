'use strict'
import {Api} from "../../Api"
import {ChannelPoints} from "./channelpoints/ChannelPoints"
import {NextFunction, Request, Response} from "express"
import {Tts} from "./tts/Tts"
import {IApiResponse} from "../Rest"
import {Channel} from "./channel/Channel"
import {HttpException} from "../../helper/HttpException"

export class V1 {
  private readonly _api: Api
  private readonly _pathBase: string
  private readonly _pathOwn = "v1"
  private readonly _channelPoints: ChannelPoints
  private readonly _tts: Tts
  private readonly _channel: Channel

  constructor (api: Api, pathBase: string) {
    this._api = api
    this._pathBase = pathBase


    this._channelPoints = new ChannelPoints(this.api, this.nextPaths)
    this._tts = new Tts(this.api, this.nextPaths)
    this._channel = new Channel(this.api, this.nextPaths)
  }

  public init (): void {
    this.api.rest.app.get(this.nextPaths, this.base.bind(this))
    this.api.rest.app.post(this.nextPaths, this.base.bind(this))

    this._channelPoints.init()
    this._tts.init()
    this._channel.init()
  }

  private get api (): Api {
    return this._api
  }

  private get nextPaths (): string {
    return this._pathBase + "/" + this._pathOwn
  }

  private async base (req: Request, res: Response, next: NextFunction): Promise<void> {
    const data: IApiResponse = {
      status: 200,
      message: "V1 Pog",
      data: {
        "Params": req.params,
        "Query": req.query,
        "Body": req.body
      }
    }
    res.json(data)
  }
}


