import { Field, InputType, Int } from '@nestjs/graphql'
import { IsOptional, Max, Min } from 'class-validator'

@InputType()
export class PagePaginationInput {
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
