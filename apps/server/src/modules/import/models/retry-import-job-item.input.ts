import { Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

@InputType()
export class RetryImportJobItemInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  importJobItemId: string

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  reason?: string
}
