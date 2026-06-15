import { Field, ID, InputType } from '@nestjs/graphql'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { ClaimReviewDecision } from '../enums'

@InputType()
export class ReviewMetadataClaimInput {
  @Field(() => ID, { description: 'The metadata claim id' })
  @IsString()
  @IsNotEmpty()
  metadataClaimId: string

  @Field(() => String, { description: 'Review action for the claim' })
  @IsEnum(ClaimReviewDecision)
  decision: ClaimReviewDecision

  @Field(() => ID, { nullable: true, description: 'Existing entity id for link_existing resolution' })
  @IsOptional()
  @IsString()
  replacementEntityId?: string

  @Field(() => String, { nullable: true, description: 'Manual value for create_new resolution' })
  @IsOptional()
  @IsString()
  replacementValue?: string

  @Field(() => String, { nullable: true, description: 'Optional reason stored in review history' })
  @IsOptional()
  @IsString()
  reason?: string
}
