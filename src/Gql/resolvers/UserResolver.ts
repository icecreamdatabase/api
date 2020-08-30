"use strict"

import "reflect-metadata"
import {Arg, Authorized, Ctx, FieldResolver, ID, Mutation, Query, Resolver, ResolverInterface, Root} from "type-graphql"
import {UserService} from "../provider/UserService"
import {User} from "../types/User"
import {NewUserInput} from "../types/input/NewUserInput"
import {ChannelSettings} from "../types/ChannelSettings"
import {ChannelSettingsService} from "../provider/ChannelSettingsService"
import {RegisterTtsPayload} from "../types/payload/RegisterTtsPayload"

@Resolver(of => User)
export class UserResolver implements ResolverInterface<User> {
  constructor (private readonly userService: UserService, private readonly channelSettingSerivce: ChannelSettingsService) {
    this.userService ??= new UserService()
    this.channelSettingSerivce ??= new ChannelSettingsService()
  }

  @Query(returns => User)
  @Authorized()
  async user (
    @Arg("id", type => ID!) id: string,
    @Ctx("requesterId") requesterId: string
  ): Promise<User> {
    const user = await UserService.findById(requesterId, id)
    if (user === undefined) {
      throw new Error("user not found")
    }
    return user
  }

  @Mutation(returns => RegisterTtsPayload)
  @Authorized()
  async registerTts (
    @Arg("newUserData") newUserData: NewUserInput,
    @Ctx("requesterId") requesterId: string
  ): Promise<RegisterTtsPayload> {
    return await UserService.addNew(requesterId, newUserData)
  }

  @Mutation(returns => Boolean)
  @Authorized()
  async unregisterTts (
    @Arg("id", type => ID) id: string,
    @Ctx("requesterId") requesterId: string
  ) {
    return await UserService.removeById(requesterId, id)
  }

  @FieldResolver(returns => ChannelSettings)
  @Authorized()
  async channelSettings (
    @Root() user: User,
    @Ctx("requesterId") requesterId: string
  ) {
    const channelSettings = ChannelSettingsService.findByRoomId(requesterId, user.id)
    if (channelSettings === undefined) {
      throw new Error("channelSettings not found")
    }
    return channelSettings
  }
}


