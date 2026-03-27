import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class BackstageGenre {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  slug: string

  // @todo add enum
  @Field(() => String)
  status: string

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => String)
  createdBy: string

  @Field(() => String)
  updatedBy: string
}
