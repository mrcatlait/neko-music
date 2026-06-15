import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class DiscoverImportInput {
  @Field(() => String, { description: 'The data source of the import method' })
  @IsString()
  @IsNotEmpty()
  dataSource: string

  @Field(() => String, { description: 'The reference to discover import source items from' })
  @IsString()
  @IsNotEmpty()
  sourceRef: string
}
