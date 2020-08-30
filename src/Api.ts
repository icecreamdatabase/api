"use strict"

import {Gql} from "./Gql/Gql"
import {Aws} from "./ExternalApis/aws/Aws"
import EventEmitter from "eventemitter3"

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

  constructor () {
    super()
    this._gql = new Gql(this)
    this._aws = new Aws()
  }

  async init () {
    await this._gql.init()
  }
}
