import { Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class CancelImportJobInput {
  @Field(() => ID, { description: 'The import job id' })
  @IsString()
  @IsNotEmpty()
  jobId: string
}
