"use strict"

import {Field, ID, ObjectType} from "type-graphql"
import {ChannelSettings} from "./ChannelSettings"
import {ISqlChannel} from "../../sql/channel/SqlChannels"

@ObjectType({description: "It's a user Pog"})
export class User {
  constructor (newChannelData: ISqlChannel) {
    this.id = newChannelData.roomId.toString()
    this.name = newChannelData.channelName
    this.channelSettings = new ChannelSettings(newChannelData)
  }

  @Field(type => ID)
  id!: string

  @Field()
  name!: string

  @Field(type => ChannelSettings, {nullable: true})
  channelSettings?: ChannelSettings
}

