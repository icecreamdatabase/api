"use strict"

import http, {IncomingMessage, Server, ServerResponse} from "http"
import {Logger} from "./helper/Logger"
import {Authentication, ICheckReturn} from "./helper/Authentication"
import {Method} from "axios"
import {Rest} from "./Rest"



export class Api {
  private readonly rest: Rest

  constructor () {
    this.rest = new Rest()
  }

}
