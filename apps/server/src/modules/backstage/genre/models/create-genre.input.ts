import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class CreateGenreInput {
  @Field(() => String)
  @IsString()
  name: string

  @Field(() => String)
  @IsString()
  slug: string
}
