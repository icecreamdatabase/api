"use strict"

import {Arg, Authorized, Ctx, Mutation, Resolver} from "type-graphql"
import {UserLevels} from "../../Enums"
import {ChannelSettings} from "../types/ChannelSettings"
import {ChannelSettingsService} from "../provider/ChannelSettingsService"
import {NewChannelSettingsInput} from "../types/NewChannelSettingsInput"

@Resolver(of => ChannelSettings)
export class ChannelSettingsResolver {
  constructor (private readonly channelSettingService: ChannelSettingsService) {
    this.channelSettingService ??= new ChannelSettingsService()
  }

  @Mutation(returns => ChannelSettings)
  @Authorized()
  updateChannelSettings (
    @Arg("newChannelSettingsData") newChannelSettingsData: NewChannelSettingsInput,
    @Ctx("requesterId") requesterId: string
  ): Promise<ChannelSettings> {
    return this.channelSettingService.updateChannelSettings(requesterId, newChannelSettingsData)
  }
}
