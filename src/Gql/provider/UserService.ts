"use strict"

import {User} from "../types/User"
import {NewUserInput} from "../types/NewUserInput"
import {ChannelSettings} from "../types/ChannelSettings"
import {Logger} from "../../helper/Logger"
import util from "util"

export class UserService {
  async findById (id: string) {
    const ch = new User()
    ch.id = id
    ch.name = `${id}xD`
    return ch
  }

  async addNew (param: { data: NewUserInput; executionUser: User }) {
    Logger.info(util.inspect(param.executionUser))
    const ch = new User()
    ch.id = param.data.id
    ch.name = `${param.data.id}xd`
    return ch
  }

  async removeById (id: string) {
    if (Math.random() > 0.5) {
      throw new Error("")
    }
  }
}

