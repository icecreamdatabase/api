"use strict"

import {User} from "../types/User"
import {NewUserInput} from "../types/NewUserInput"
import {SqlChannels} from "../../sql/channel/SqlChannels"

export class UserService {
  public static async findById (requesterId: string, roomId: string): Promise<User | undefined> {
    const channel = await SqlChannels.get(roomId)
    if (channel) {
      const ch = new User()
      ch.id = channel.roomId.toString()
      ch.name = channel.channelName
      return ch
    }
    return undefined
  }

  public static async addNew (requesterId: string, data: NewUserInput): Promise<User> {
    //TODO

    const ch = new User()
    ch.id = data.id
    ch.name = `${data.id}xd`
    return ch
  }

  public static async removeById (requesterId: string, roomId: string) {

    try {
      await SqlChannels.disableChannel(roomId)
      return true
    } catch (e: unknown) {
      return false
    }
  }
}

