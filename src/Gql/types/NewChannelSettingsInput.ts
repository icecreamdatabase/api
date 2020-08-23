"use strict"

import {Field, ID, InputType} from "type-graphql"

@InputType()
export class NewChannelSettingsInput {
  @Field(type => ID)
  roomId!: string

  @Field({nullable: true})
  maxMessageLength?: number

  @Field({nullable: true})
  minCooldown?: number

  @Field({nullable: true})
  timeoutCheckTime?: number

  @Field({nullable: true})
  ircMuted?: boolean

  @Field({nullable: true})
  isQueueMessages?: boolean

  @Field({nullable: true})
  volume?: number

  @Field({nullable: true})
  allModsAreEditors?: boolean
}
