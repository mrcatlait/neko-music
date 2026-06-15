import { Field, ID, InputType } from '@nestjs/graphql'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class StartImportFromDiscoveryInput {
  @Field(() => ID, { description: 'The discovery snapshot id' })
  @IsString()
  @IsNotEmpty()
  discoveryId: string

  @Field(() => [ID], { description: 'The selected discovery item ids to start import with' })
  @IsArray()
  selectedItemIds: string[]
}
