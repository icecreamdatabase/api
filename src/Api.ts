"use strict"

import {Rest} from "./Rest/Rest"
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
  private readonly _rest: Rest
  private readonly _aws: Aws

  constructor () {
    super()
    this._rest = new Rest(this)
    this._aws = new Aws()
  }

  public init () {
    this.rest.init()
  }

  public get rest () {
    return this._rest
  }

  public get aws () {
    return this._aws
  }
}
