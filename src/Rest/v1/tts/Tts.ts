'use strict'
import {Api} from "../../../Api"
import {Request, Response} from "express"
import {Polly} from "aws-sdk"
import {IApiResponse} from "../../Rest"

interface ITtsQuery {
  voiceId: Polly.VoiceId,
  text: string,
  engine: Polly.Engine
}

export class Tts {
  private readonly _api: Api
  private readonly _pathBase: string
  private readonly _pathOwn = "tts"

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
    const query = (<unknown>req.query) as ITtsQuery

    try {
      const audio = await this.api.aws.synthesize(query.voiceId, query.text, query.engine)
      //res.json(data)
      res.header("Content-Type", "audio/mp3")
      res.write(audio.AudioStream)
      res.end()
    } catch (e) {
      const data: IApiResponse = {
        status: 400,
        message: "Error in request",
        data: e
      }
      res.json(data)
      res.end()
    }
  }
}


