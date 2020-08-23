"use strict"

import "reflect-metadata"
import {Arg, Authorized, Ctx, FieldResolver, ID, Mutation, Query, Resolver, ResolverInterface, Root} from "type-graphql"
import {UserService} from "../provider/UserService"
import {User} from "../types/User"
import {NewUserInput} from "../types/NewUserInput"
import {UserLevels} from "../../Enums"
import {ChannelSettings} from "../types/ChannelSettings"
import {ChannelSettingsService} from "../provider/ChannelSettingsService"

@Resolver(of => User)
export class UserResolver implements ResolverInterface<User>{
  constructor (private readonly userService: UserService, private readonly channelSettingSerivce: ChannelSettingsService) {
    this.userService ??= new UserService()
    this.channelSettingSerivce ??= new ChannelSettingsService()
  }

  @Query(returns => User)
  async user (@Arg("id", type => ID!) id: string) {
    const channel = await this.userService.findById(id)
    if (channel === undefined) {
      throw new Error("user not found")
    }
    return channel
  }

  @Mutation(returns => User)
  @Authorized([UserLevels.BROADCASTER])
  registerTts (
    @Arg("newUserData") newUserData: NewUserInput,
    @Ctx("user") executionUser: User //TODO
  ): Promise<User> {
    return this.userService.addNew({data: newUserData, executionUser})
  }

  @Mutation(returns => Boolean)
  @Authorized([UserLevels.BROADCASTER])
  async unregisterTts (@Arg("id", type => ID) id: string) {
    try {
      await this.userService.removeById(id)
      return true
    } catch {
      return false
    }
  }

  @FieldResolver(returns => ChannelSettings)
  @Authorized([UserLevels.MODERATOR])
  async channelSettings (@Root() user: User) {
    const channelSettings = this.channelSettingSerivce.findByUser(user)
    if (channelSettings === undefined) {
      throw new Error("channelSettings not found")
    }
    return channelSettings
  }

}


