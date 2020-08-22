'use strict'
import {Api} from "../../../Api"
import {NextFunction, Request, Response} from "express"
import {IApiResponse} from "../../Rest"
import {HttpException} from "../../../helper/HttpException"
import {Logger} from "../../../helper/Logger"
import {SqlChannels} from "../../../sql/channel/SqlChannels"

enum OAuthLevelsV1Channel {
  "noAuth",
  "user",
  "moderator",
  "editor",
  "broadcaster",
  "botAdmin",
  "botOwner",
  "bot"
}

interface channelParams {
  roomId: string
}

export class Channel {
  private readonly _api: Api
  private readonly _pathBase: string
  private static readonly _pathOwn = "channel"
  private static readonly _parameterRoomId = "/:roomId(\\d+)"

  constructor (api: Api, pathBase: string) {
    this._api = api
    this._pathBase = pathBase
  }

  public init (): void {
    this.api.rest.app.use(this.nextPaths + Channel._parameterRoomId, this.addAuthLevel.bind(this))
    this.api.rest.app.get(this.nextPaths, this.base.bind(this))
    this.api.rest.app.post(this.nextPaths + Channel._parameterRoomId, this.addUser.bind(this))
    this.api.rest.app.put(this.nextPaths + Channel._parameterRoomId, this.addUser.bind(this))
    this.api.rest.app.delete(this.nextPaths + Channel._parameterRoomId, this.disableUser.bind(this))
  }

  private get api (): Api {
    return this._api
  }

  private get nextPaths (): string {
    return this._pathBase + "/" + Channel._pathOwn
  }

  private async addAuthLevel (req: Request, res: Response, next: NextFunction) {
    Logger.info("xd")
    req.oAuthLevelV1Channel = OAuthLevelsV1Channel.noAuth
    if (req.oAuthData) {
      const userId = req.oAuthData.user_id
      const roomId = (<channelParams><unknown>req.params).roomId

      if (userId === "478777352") { //TODO don't hardcode this!
        req.oAuthLevelV1Channel = OAuthLevelsV1Channel.bot

      } else if (["38949074"].includes(userId)) { //TODO don't hardcode this!
        req.oAuthLevelV1Channel = OAuthLevelsV1Channel.botOwner

      } else if (["99308836"].includes(userId)) { //TODO don't hardcode this!
        req.oAuthLevelV1Channel = OAuthLevelsV1Channel.botOwner

      } else if (userId === roomId) {
        req.oAuthLevelV1Channel = OAuthLevelsV1Channel.broadcaster

      } else if (["" /*list of editors*/].includes(userId)) {
        req.oAuthLevelV1Channel = OAuthLevelsV1Channel.editor

      } else if (false /*isMod(roomId, userId)*/) {
        req.oAuthLevelV1Channel = OAuthLevelsV1Channel.moderator

      } else {
        req.oAuthLevelV1Channel = OAuthLevelsV1Channel.user
      }
    }
    next()
  }

  private async base (req: Request, res: Response, next: NextFunction): Promise<void> {
    res.end()
  }

  private async addUser (req: Request, res: Response, next: NextFunction): Promise<void> {
    if (!req.oAuthData) {
      next(new HttpException(500, "oAuthData was undefined even though it shouldn't be able to"))
      return
    }

    // Is own channel
    if (req.oAuthLevelV1Channel < OAuthLevelsV1Channel.broadcaster) {
      next(new HttpException(403,
        "You can only register your own channel",
        {
          "userId": req.oAuthData?.user_id,
          "roomId": req.params.roomId
        }))
      return
    }

    //Is partner or affiliate
    if (false /*TODO !affiliate && !parter*/) {
      next(new HttpException(403,
        "You need to be a partner or affiliate to use channelpoints",
        {
          "roomId": req.params.roomId
        }))
      return
    }

    await SqlChannels.addChannel(parseInt(req.params.roomId), req.oAuthData.login, false /* TODO */)

    const data: IApiResponse = {
      status: 201,
      message: "User registered.",
      data: {
        "roomId": req.params.roomId
      }
    }
    res.status(201).json(data)
  }

  private async disableUser (req: Request, res: Response, next: NextFunction): Promise<void> {
    // Is own channel
    if (req.oAuthLevelV1Channel < OAuthLevelsV1Channel.broadcaster) {
      next(new HttpException(403,
        "You can only disable your own channel",
        {
          "userId": req.oAuthData?.user_id,
          "roomId": req.params.roomId
        }))
      return
    }

    await SqlChannels.disableChannel(req.params.roomId)

    const data: IApiResponse = {
      status: 200,
      message: "User deactivated.",
      data: {
        "roomId": req.params.roomId
      }
    }
    res.status(200).json(data)
  }

}


