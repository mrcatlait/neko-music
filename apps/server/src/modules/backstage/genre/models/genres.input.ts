import { Field, InputType } from '@nestjs/graphql'

import { GenresFiltersInput } from './genres-filters.input'
import { PagePaginationInput } from '../../shared/models'

@InputType()
export class GenresInput {
  @Field(() => GenresFiltersInput, { nullable: true })
  filters?: GenresFiltersInput

  @Field(() => PagePaginationInput, { nullable: true })
  pagination?: PagePaginationInput
}
