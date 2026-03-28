import { ArgsType, Field } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

import { PagePaginationArgs } from './page-pagination.args'

@ArgsType()
export class FilterArgs extends PagePaginationArgs {
  @Field(() => String, { nullable: true, description: 'The search query' })
  @IsString()
  @IsOptional()
  search?: string
}
