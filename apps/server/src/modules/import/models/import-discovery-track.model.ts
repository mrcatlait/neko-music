import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ImportDiscoveryTrack {
  @Field(() => ID)
  id: string

  @Field(() => String)
  sourceItemRef: string

  @Field(() => String)
  label: string

  @Field(() => Int)
  position: number

  @Field(() => Boolean)
  isSelected: boolean
}
