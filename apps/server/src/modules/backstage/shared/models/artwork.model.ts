import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Artwork {
  @Field(() => String, {
    description: 'The template URL with {size} placeholder; use preset names (small, medium, large)',
  })
  url: string

  @Field(() => String, {
    description: 'The dominant color of the artwork',
  })
  dominantColor: string
}
