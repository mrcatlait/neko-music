import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

import { ArtistRole as ArtistRoleEnum } from '@/modules/shared/enums'

export class ArtistRole implements Contracts.Shared.Dtos.ArtistRole {
  @ApiProperty({
    description: 'The ID of the artist',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    description: 'The role of the artist in the album',
    example: ArtistRoleEnum.Primary,
  })
  @IsEnum(ArtistRoleEnum)
  @IsNotEmpty()
  role: ArtistRoleEnum
}
