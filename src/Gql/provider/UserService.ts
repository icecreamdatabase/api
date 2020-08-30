"use strict"

import {User} from "../types/User"
import {NewUserInput} from "../types/NewUserInput"
import {SqlChannels} from "../../sql/channel/SqlChannels"
import {Authentication} from "../Authentication"
import {UserLevels} from "../../Enums"
import {TwitchApiFunctionality} from "../../ExternalApis/twitch/TwitchApiFunctionality"

export class UserService {
  public static async findById (requesterId: string, roomId: string): Promise<User | undefined> {
    const channel = await SqlChannels.get(roomId)
    if (channel) {
      return new User(channel)
    }
    return undefined
  }

  public static async addNew (requesterId: string, data: NewUserInput): Promise<User | undefined> {
    await Authentication.userLevelChecker(data.id, requesterId, UserLevels.BROADCASTER)

    const signupInfo = await TwitchApiFunctionality.getSignupInfo(data.id)
    if (!signupInfo) {
      return //TODO: Error channel doesn't exist
    }
    if (signupInfo.type === "") {
      return //TODO: Error not affiliate / partner
    }

    try {
      await SqlChannels.addChannel(signupInfo.id, signupInfo.login, signupInfo.type === "partner")
      const newChannelData = await SqlChannels.get(signupInfo.id)
      if (!newChannelData) {
        return //TODO: some internal error?
      }
      return new User(newChannelData)
    } catch (e: unknown) {
      return
    }
  }

  public static async removeById (requesterId: string, roomId: string) {
    await Authentication.userLevelChecker(roomId, requesterId, UserLevels.BROADCASTER)
    try {
      await SqlChannels.disableChannel(roomId)
      return true
    } catch (e: unknown) {
      return false
    }
  }
}

