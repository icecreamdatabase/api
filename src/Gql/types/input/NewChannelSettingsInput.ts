"use strict"

import {Field, ID, InputType, Int} from "type-graphql"

@InputType()
export class NewChannelSettingsInput {
  @Field(type => ID)
  roomId!: string

  @Field(type => Int, {nullable: true})
  maxMessageLength?: number

  @Field(type => Int, {nullable: true})
  minCooldown?: number

  @Field(type => Int, {nullable: true})
  timeoutCheckTime?: number

  @Field({nullable: true})
  ircMuted?: boolean

  @Field({nullable: true})
  isQueueMessages?: boolean

  @Field(type => Int, {nullable: true})
  volume?: number

  @Field({nullable: true})
  allModsAreEditors?: boolean
}
