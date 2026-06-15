import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ImportJobItemPromotionEligibility {
  @Field(() => ID)
  importJobItemId: string

  @Field(() => Boolean)
  isEligible: boolean

  @Field(() => [String])
  unresolvedRequiredFields: string[]
}
