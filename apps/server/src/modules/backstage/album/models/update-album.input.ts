import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsBoolean, IsDate, IsString, IsUUID } from 'class-validator'

import { AlbumType } from '@/modules/shared/enums'

@InputType()
export class UpdateAlbumInput {
  @Field(() => String)
  @IsString()
  name: string

  @Field(() => Date)
  @IsDate()
  releaseDate: Date

  @Field(() => Boolean)
  @IsBoolean()
  explicit: boolean

  @Field(() => String)
  @IsString()
  type: AlbumType

  @Field(() => [String])
  @IsArray()
  @IsUUID('4', { each: true })
  genres: string[]
}
