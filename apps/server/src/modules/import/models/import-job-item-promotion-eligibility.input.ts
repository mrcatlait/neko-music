import { Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class ImportJobItemPromotionEligibilityInput {
  @Field(() => ID, { description: 'The import job item id' })
  @IsString()
  @IsNotEmpty()
  importJobItemId: string
}
