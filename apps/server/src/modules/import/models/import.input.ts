import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class ImportInput {
  @Field(() => String, { description: 'The data source of the import' })
  @IsString()
  @IsNotEmpty()
  dataSource: string

  @Field(() => String, { description: 'The reference to the source data' })
  @IsString()
  @IsNotEmpty()
  sourceRef: string
}
