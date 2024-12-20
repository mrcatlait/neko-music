import { IsEnum, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { CollectionType } from '@modules/shared/enums'

export class AddCollectionToPlaylistDto {
  @IsString()
  @ApiProperty()
  collectionId: string

  @IsEnum(CollectionType)
  @ApiProperty({ enum: CollectionType })
  collectionType: CollectionType
}
