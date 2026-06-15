import { Field, ID, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ImportJobItemClaim {
  @Field(() => ID)
  id: string

  @Field(() => String)
  importJobItemId: string

  @Field(() => String)
  field: string

  @Field(() => String)
  value: string

  @Field(() => String)
  sourceAttribute: string

  @Field(() => String)
  extractor: string

  @Field(() => Int)
  confidence: number

  @Field(() => String)
  decision: string

  @Field(() => String, { nullable: true })
  replacementEntityId: string | null

  @Field(() => String, { nullable: true })
  replacementValue: string | null
}
