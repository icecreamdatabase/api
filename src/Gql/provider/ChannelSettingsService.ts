"use strict"

import {User} from "../types/User"
import {ChannelSettings} from "../types/ChannelSettings"
import {NewChannelSettingsInput} from "../types/NewChannelSettingsInput"
import {SqlChannels, SqlChannelUpdateParameter} from "../../sql/channel/SqlChannels"
import {Logger} from "../../helper/Logger"

export class ChannelSettingsService {
  async findByUser (user: User): Promise<ChannelSettings | undefined> {
    return ChannelSettingsService.findByRoomId(user.id)
  }

  private static async findByRoomId (roomId: number | string): Promise<ChannelSettings | undefined> {
    const channel = await SqlChannels.get(roomId)
    if (channel) {
      const cs = new ChannelSettings(channel)
      cs.user = {id: roomId.toString(), channelSettings: cs, name: channel.channelName}
      return cs
    }
    return undefined
  }

  async updateChannelSettings (param: { data: NewChannelSettingsInput; executionUser: User }): Promise<ChannelSettings> {
    try {
      for (const paramElement in param.data) {
        if (Object.prototype.hasOwnProperty.call(param.data, paramElement)) {
          const key = <SqlChannelUpdateParameter | "roomId">paramElement
          const value = <number | string | boolean>param.data[<keyof NewChannelSettingsInput>paramElement]

          if (key !== "roomId") {
            await SqlChannels.updateSetting(parseInt(param.data.roomId), key, value)
          }
        }
      }

      const channel = await ChannelSettingsService.findByRoomId(param.data.roomId)
      if (channel) {
        return channel
      }
    } catch (e: unknown) {
      Logger.info(e)
    }
    throw new Error(`That user isn't registered`)
  }

}
