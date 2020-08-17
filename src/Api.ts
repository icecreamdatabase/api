"use strict"

import {Rest} from "./Rest/Rest"
import {Aws} from "./aws/Aws"
import {Logger} from "./helper/Logger"


export class Api {
  private readonly _rest: Rest
  private readonly _aws: Aws

  constructor () {
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
