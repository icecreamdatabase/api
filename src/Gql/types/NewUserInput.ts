"use strict"

import {Field, ID, InputType} from "type-graphql"

@InputType()
export class NewUserInput {
  @Field(type => ID)
  id!: string
}
