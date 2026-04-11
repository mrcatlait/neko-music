import { Field, InputType } from '@nestjs/graphql'

import { PagePaginationInput } from '../../shared/models'

@InputType()
export class AlbumsInput {
  @Field(() => PagePaginationInput, { nullable: true })
  pagination?: PagePaginationInput
}
