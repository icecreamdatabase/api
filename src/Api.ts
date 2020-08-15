"use strict"

import {Logger} from "./helper/Logger"
import {Rest} from "./Rest/Rest"



export class Api {
  private readonly rest: Rest

  constructor () {
    this.rest = new Rest()
  }

}
