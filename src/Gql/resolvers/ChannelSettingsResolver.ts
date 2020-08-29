"use strict"

import {Arg, Authorized, Ctx, Mutation, Resolver} from "type-graphql"
import {User} from "../types/User"
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
  @Authorized([UserLevels.EDITOR])
  updateChannelSettings (
    @Arg("newChannelSettingsData") newChannelSettingsData: NewChannelSettingsInput,
    @Ctx("user") executionUser: User //TODO
  ): Promise<ChannelSettings> {
    return this.channelSettingService.updateChannelSettings({data: newChannelSettingsData, executionUser})
  }
}
