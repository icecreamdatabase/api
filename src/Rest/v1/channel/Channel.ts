'use strict'
import {Api} from "../../../Api"
import {NextFunction, Request, Response} from "express"
import {IApiResponse} from "../../Rest"
import {HttpException} from "../../../helper/HttpException"

export class Channel {
  private readonly _api: Api
  private readonly _pathBase: string
  private readonly _pathOwn = "channel"

  constructor (api: Api, pathBase: string) {
    this._api = api
    this._pathBase = pathBase
  }

  public init (): void {
    this.api.rest.app.get(this.nextPaths, this.base.bind(this))
    this.api.rest.app.get(this.nextPaths + "/:roomId", this.base.bind(this))
    this.api.rest.app.get(this.nextPaths + "/:roomId/settings", this.getSettings.bind(this))
    this.api.rest.app.patch(this.nextPaths + "/:roomId/settings", this.changeSettings.bind(this))
    this.api.rest.app.put(this.nextPaths + "/:roomId/register", this.addUser.bind(this))

  }

  private get api (): Api {
    return this._api
  }

  private get nextPaths (): string {
    return this._pathBase + "/" + this._pathOwn
  }

  private async base (req: Request, res: Response, next: NextFunction): Promise<void> {
  }

  private async getSettings (req: Request, res: Response, next: NextFunction): Promise<void> {

  }

  private async changeSettings (req: Request, res: Response, next: NextFunction): Promise<void> {

  }

  private async addUser (req: Request, res: Response, next: NextFunction): Promise<void> {
    // Is own channel
    if (!req.oAuthData?.user_id || req.oAuthData.user_id !== req.params.roomId) {
      next(new HttpException(403,
        "You can only register your own channel",
        {
          "userId": req.oAuthData?.user_id,
          "roomId": req.params.roomId
        }))
      return
    }



    const data: IApiResponse = {
      status: 201,
      message: "User registered.",
      data: {
        "roomId": req.params.roomId
      }
    }
    res.json(data)
    res.end()
  }

}


