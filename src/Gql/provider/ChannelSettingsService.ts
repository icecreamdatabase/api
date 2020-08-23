"use strict"

import {User} from "../types/User"
import {NewUserInput} from "../types/NewUserInput"
import {ChannelSettings} from "../types/ChannelSettings"
import {NewChannelSettingsInput} from "../types/NewChannelSettingsInput"

export class ChannelSettingsService {
  async findByUser (user: User): Promise<ChannelSettings> {
    const cs = new ChannelSettings()
    cs.user = user
    cs.maxMessageLength = 250
    cs.minCooldown = 0
    cs.timeoutCheckTime = 2
    cs.ircMuted = false
    cs.isQueueMessages = true
    cs.volume = 100
    cs.allModsAreEditors = false
    return cs
  }

  updateChannelSettings (param: {data: NewChannelSettingsInput; executionUser: User}): Promise<ChannelSettings> {
    throw new Error("That user isn't registered")
    //return Promise.resolve(undefined)
  }
}
