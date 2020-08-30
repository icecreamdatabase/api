"use strict"

import {User} from "../types/User"
import {ChannelSettings} from "../types/ChannelSettings"
import {NewChannelSettingsInput} from "../types/input/NewChannelSettingsInput"
import {SqlChannels, SqlChannelUpdateParameter} from "../../sql/channel/SqlChannels"
import {Logger} from "../../helper/Logger"

export class ChannelSettingsService {
  public static async findByRoomId (requesterId: string, roomId: string): Promise<ChannelSettings | undefined> {
    const channel = await SqlChannels.get(roomId)
    if (channel) {
      const cs = new ChannelSettings(channel)
      cs.user = <User>{id: roomId, channelSettings: cs, name: channel.channelName}
      return cs
    }
    return undefined
  }

  async updateChannelSettings (requesterId: string, data: NewChannelSettingsInput): Promise<ChannelSettings> {
    try {
      for (const paramElement in data) {
        if (Object.prototype.hasOwnProperty.call(data, paramElement)) {
          const key = <SqlChannelUpdateParameter | "roomId">paramElement
          const value = <number | string | boolean>data[<keyof NewChannelSettingsInput>paramElement]

          if (key !== "roomId") {
            await SqlChannels.updateSetting(parseInt(data.roomId), key, value)
          }
        }
      }

      const channel = await ChannelSettingsService.findByRoomId(requesterId, data.roomId)
      if (channel) {
        return channel
      }
    } catch (e: unknown) {
      Logger.info(e)
    }
    throw new Error(`That user isn't registered`)
  }

}
