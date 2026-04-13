import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

import { Artwork } from '../../shared/models'
import { PublishingStatus } from '../../shared/enums'
import { Playback } from './playback.model'

import { TrackType } from '@/modules/shared/enums'

@ObjectType()
export class BackstageTrack {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  albumId: string

  @Field(() => Int)
  trackNumber: number

  @Field(() => Int)
  diskNumber: number

  @Field(() => Date)
  releaseDate: Date

  @Field(() => String)
  type: TrackType

  @Field(() => Boolean)
  explicit: boolean

  @Field(() => String)
  status: PublishingStatus

  @Field(() => Artwork, { nullable: true })
  artwork?: Artwork | null

  @Field(() => Playback, { nullable: true })
  playback?: Playback | null
}
