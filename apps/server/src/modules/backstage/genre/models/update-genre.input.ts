import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class UpdateGenreInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  slug: string
}
