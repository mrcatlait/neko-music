import { Field, ID, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
export class RefreshImportDiscoveryInput {
  @Field(() => ID, { description: 'The discovery snapshot id to refresh from' })
  @IsString()
  @IsNotEmpty()
  discoveryId: string
}
