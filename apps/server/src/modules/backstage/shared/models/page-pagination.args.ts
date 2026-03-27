import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsOptional, Max, Min } from 'class-validator'

@ArgsType()
export class PagePaginationArgs {
  @Field(() => Int, { nullable: true, description: 'The limit of the page' })
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 10

  @Field(() => Int, { nullable: true, description: 'The offset of the page' })
  @Min(0)
  @IsOptional()
  offset: number = 0
}
