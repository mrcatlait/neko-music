import { Field, ID, ObjectType } from '@nestjs/graphql'

import { BackstageGenre } from '../../genre/models'
import { MediaStatus, PublishingStatus } from '../../shared/enums'
import { Artwork } from '../../shared/models'

@ObjectType()
export class BackstageArtist {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => Boolean)
  verified: boolean

  @Field(() => String)
  status: PublishingStatus

  @Field(() => Artwork, { nullable: true })
  artwork?: Artwork | null

  @Field(() => String, { nullable: true })
  mediaStatus?: MediaStatus

  @Field(() => [BackstageGenre], { nullable: true })
  genres?: BackstageGenre[]

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => String)
  createdBy: string

  @Field(() => String)
  updatedBy: string
}
