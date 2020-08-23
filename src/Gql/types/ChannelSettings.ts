"use strict"

import {Field, ObjectType} from "type-graphql"
import {User} from "./User"

@ObjectType({description: "These are channelSettings"})
export class ChannelSettings {
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
