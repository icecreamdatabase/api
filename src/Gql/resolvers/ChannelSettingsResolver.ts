"use strict"

import {Authorized, FieldResolver, Query, Resolver, ResolverInterface, Root} from "type-graphql"
import {User} from "../types/User"
import {UserLevels} from "../../Enums"
import {ChannelSettings} from "../types/ChannelSettings"
import {ChannelSettingsService} from "../provider/ChannelSettingsService"

@Resolver(of => ChannelSettings)
export class ChannelSettingsResolver {
  constructor (private readonly channelSettingService: ChannelSettingsService) {
    this.channelSettingService ??= new ChannelSettingsService()
  }
}
