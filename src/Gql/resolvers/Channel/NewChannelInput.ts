import {Field, ID, InputType} from "type-graphql"

@InputType()
export class NewChannelInput {
  @Field(type => ID)
  id!: string
}
