import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsEnum } from 'class-validator'

import { PlaylistType } from '../enums'

export class UpdatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string

  @IsString()
  @ApiProperty()
  description: string

  @IsEnum(PlaylistType)
  @ApiProperty({
    enum: PlaylistType,
  })
  type: PlaylistType
}
