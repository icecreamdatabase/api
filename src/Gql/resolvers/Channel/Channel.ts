import {Field, ID, ObjectType} from "type-graphql"

@ObjectType({description: "It's a channel Pog"})
export class Channel {
  @Field(type => ID)
  id!: string

  @Field()
  name!: string
}
