import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ImportJobItemModel {
  @Field(() => ID)
  id: string

  @Field(() => String)
  sourceItemRef: string

  @Field(() => String)
  label: string

  @Field(() => String)
  status: string

  @Field(() => Int)
  retryCount: number

  @Field(() => String, { nullable: true })
  errorMessage: string | null
}
