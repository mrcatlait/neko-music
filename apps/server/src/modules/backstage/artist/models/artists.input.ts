import { Field, InputType } from '@nestjs/graphql'

import { PagePaginationInput } from '../../shared/models'

@InputType()
export class ArtistsInput {
  @Field(() => PagePaginationInput, { nullable: true })
  pagination?: PagePaginationInput
}
