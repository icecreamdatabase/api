"use strict"

import {User} from "../types/User"
import {NewUserInput} from "../types/input/NewUserInput"
import {SqlChannels} from "../../sql/channel/SqlChannels"
import {Authentication} from "../Authentication"
import {UserLevels} from "../../Enums"
import {TwitchApiFunctionality} from "../../ExternalApis/twitch/TwitchApiFunctionality"
import {RegisterTtsPayload} from "../types/payload/RegisterTtsPayload"
import {RegisterTtsErrorCode} from "../types/ErrorEnums"

export class UserService {
  public static async findById (requesterId: string, roomId: string): Promise<User | undefined> {
    const channel = await SqlChannels.get(roomId)
    if (channel) {
      return new User(channel)
    }
    return undefined
  }

  public static async addNew (requesterId: string, data: NewUserInput): Promise<RegisterTtsPayload> {
    await Authentication.userLevelChecker(data.id, requesterId, UserLevels.BROADCASTER)
    const payload = new RegisterTtsPayload()

    const signupInfo = await TwitchApiFunctionality.getSignupInfo(data.id)
    if (!signupInfo) {
      payload.error = RegisterTtsErrorCode.CHANNEL_DOES_NOT_EXIST
      return payload
    }
    if (signupInfo.type === "") {
      payload.error = RegisterTtsErrorCode.CHANNEL_NOT_AFFILIATE_OR_PARTNER
      return payload
    }

    try {
      await SqlChannels.addChannel(signupInfo.id, signupInfo.login, signupInfo.type === "partner")
      const newChannelData = await SqlChannels.get(signupInfo.id)
      if (newChannelData) {
        payload.user = new User(newChannelData)
      } else {
        payload.error = RegisterTtsErrorCode.UNKOWN
      }
    } catch (e: unknown) {
      payload.error = RegisterTtsErrorCode.UNKOWN
    }
    return payload
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

