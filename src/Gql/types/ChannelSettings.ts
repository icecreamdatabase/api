"use strict"

import {Field, ObjectType} from "type-graphql"
import {User} from "./User"
import {ISqlChannel} from "../../sql/channel/SqlChannels"

@ObjectType({description: "These are channelSettings"})
export class ChannelSettings {

  constructor (channel: ISqlChannel) {
    this.maxMessageLength = channel.maxMessageLength
    this.minCooldown = channel.minCooldown
    this.timeoutCheckTime = channel.timeoutCheckTime
    this.ircMuted = channel.ircMuted
    this.isQueueMessages = channel.isQueueMessages
    this.volume = channel.volume
    this.allModsAreEditors = channel.allModsAreEditors
  }

  @Field(type => User)
  user!: User

  @Field()
  maxMessageLength!: number

  @Field()
  minCooldown!: number

  @Field()
  timeoutCheckTime!: number

  @Field()
  ircMuted!: boolean

  @Field()
  isQueueMessages!: boolean

  @Field()
  volume!: number

  @Field()
  allModsAreEditors!: boolean
}
