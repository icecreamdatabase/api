"use strict"

import {Gql} from "./Gql/Gql"
import {Aws} from "./aws/Aws"
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

  public init () {
    this.gql.init()
  }

  public get gql () {
    return this._gql
  }

  public get aws () {
    return this._aws
  }
}
