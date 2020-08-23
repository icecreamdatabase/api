"use strict"

import {Field, ID, ObjectType} from "type-graphql"
import {ChannelSettings} from "./ChannelSettings"

@ObjectType({description: "It's a user Pog"})
export class User {
  @Field(type => ID)
  id!: string

  @Field()
  name!: string

  @Field(type => ChannelSettings, {nullable: true})
  channelSettings?: ChannelSettings
}

