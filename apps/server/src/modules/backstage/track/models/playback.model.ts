import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Playback {
  @Field(() => String)
  url: string

  @Field(() => String)
  format: string
}
