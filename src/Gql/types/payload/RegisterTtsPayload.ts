"use strict"

import {Field, ObjectType} from "type-graphql"
import {User} from "../User"
import {ISqlChannel} from "../../../sql/channel/SqlChannels"
import {RegisterTtsErrorCode} from "../ErrorEnums"

@ObjectType()
export class RegisterTtsPayload {
  constructor (newChannelData?: ISqlChannel) {
    if (newChannelData) {
      this.user = new User(newChannelData)
    }
  }

  @Field(type => User, {nullable: true})
  user?: User

  @Field(type => RegisterTtsErrorCode, {nullable: true})
  error?: RegisterTtsErrorCode
}

