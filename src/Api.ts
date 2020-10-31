"use strict"

import {Gql} from "./Gql/Gql"
import {Aws} from "./ExternalApis/aws/Aws"
import EventEmitter from "eventemitter3"
import {Tts} from "./Tts/Tts"

export enum Events {
  "UpdateSettings",
  "UpdateVoiceRewards",
  "UpdateEditors",
  "UpdateQueue",
  "Pause",
  "SkipNext",
  "SkipId",
}

export class Api extends EventEmitter {
  private readonly _gql: Gql
  private readonly _aws: Aws
  private readonly _tts: Tts

  constructor () {
    super()
    this._gql = new Gql(this)
    this._aws = new Aws()
    this._tts = new Tts()
  }

  async init () {
    await this._gql.init()
  }
}
