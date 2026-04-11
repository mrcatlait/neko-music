import { Field, ID, ObjectType } from '@nestjs/graphql'

import { PublishingStatus } from '../../shared/enums'
import { Artwork } from '../../shared/models'

import { AlbumType } from '@/modules/shared/enums'

@ObjectType()
export class BackstageAlbum {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => Date)
  releaseDate: Date

  @Field(() => Boolean)
  explicit: boolean

  @Field(() => String)
  type: AlbumType

  @Field(() => String)
  status: PublishingStatus

  @Field(() => Artwork, { nullable: true })
  artwork?: Artwork | null
}
