"use strict"

import {Rest} from "./Rest/Rest"


export class Api {
  private readonly _rest: Rest

  constructor () {
    this._rest = new Rest(this)
  }

  public init () {
    this.rest.init()
  }

  public get rest () {
    return this._rest
  }
}
