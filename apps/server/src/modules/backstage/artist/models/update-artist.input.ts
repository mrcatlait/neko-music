import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsBoolean, IsString, IsUUID } from 'class-validator'

@InputType()
export class UpdateArtistInput {
  @Field(() => String)
  @IsString()
  name: string

  @Field(() => Boolean)
  @IsBoolean()
  verified: boolean

  @Field(() => [String])
  @IsArray()
  @IsUUID('4', { each: true })
  genres: string[]
}
