import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { PageOptionsDto } from '@modules/shared/dtos'
import { CollectionType } from '@modules/shared/enums'

export class CollectionMembershipOptionsDto extends PageOptionsDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The ID of the collection',
  })
  collectionId: string

  @IsEnum(CollectionType)
  @IsNotEmpty()
  @ApiProperty({
    description: 'The type of the collection',
    enum: CollectionType,
  })
  collectionType: CollectionType
}
