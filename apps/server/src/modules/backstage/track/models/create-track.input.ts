import { Field, InputType, Int } from '@nestjs/graphql'
import { IsArray, IsBoolean, IsDate, IsInt, IsString, IsUUID } from 'class-validator'

import { TrackType } from '@/modules/shared/enums'

@InputType()
export class CreateTrackInput {
  @Field(() => String)
  @IsString()
  name: string

  @Field(() => String)
  @IsString()
  albumId: string

  @Field(() => Int)
  @IsInt()
  trackNumber: number

  @Field(() => Int)
  @IsInt()
  diskNumber: number

  @Field(() => Date)
  @IsDate()
  releaseDate: Date

  @Field(() => String)
  @IsString()
  type: TrackType

  @Field(() => Boolean)
  @IsBoolean()
  explicit: boolean

  @Field(() => [String])
  @IsArray()
  @IsUUID('4', { each: true })
  genres: string[]
}
