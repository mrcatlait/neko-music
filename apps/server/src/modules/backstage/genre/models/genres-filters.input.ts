import { Field, InputType } from '@nestjs/graphql'
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator'

@InputType()
export class GenresFiltersInput {
  @Field(() => String, { nullable: true, description: 'The search query' })
  @IsString()
  @IsOptional()
  search?: string

  @Field(() => [String], { nullable: true, description: 'The IDs of the genres' })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  ids?: string[]
}
