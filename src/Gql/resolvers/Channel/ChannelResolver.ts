"use strict"

import "reflect-metadata"
import {Arg, Authorized, ID, Mutation, Query, Resolver} from "type-graphql"
import {ChannelService} from "./ChannelService"
import {Channel} from "./Channel"
import {NewChannelInput} from "./NewChannelInput"
import {UserLevels} from "../../../Enums"

@Resolver(Channel)
export class ChannelResolver {
  constructor (private readonly channelService: ChannelService) {
    this.channelService ??= new ChannelService()
  }

  @Query(returns => Channel)
  async channel (@Arg("id") id: string) {
    const channel = await this.channelService.findById(id)
    if (channel === undefined) {
      throw new Error("channel not found")
    }
    return channel
  }

  @Mutation(returns => Channel)
  @Authorized([UserLevels.BROADCASTER])
  addChannel (
    @Arg("newChannelData") newChannelData: NewChannelInput
    //@Ctx("user") user: User,
  ): Promise<Channel> {
    return this.channelService.addNew({data: newChannelData})
  }

  @Mutation(returns => Boolean)
  @Authorized([UserLevels.BROADCASTER])
  async removeChannel(@Arg("id", type => ID) id: string) {
    try {
      await this.channelService.removeById(id)
      return true
    } catch {
      return false
    }
  }

}

