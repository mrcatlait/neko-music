import { IsString, IsEnum, IsOptional, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { PlaylistType } from '@modules/playlist/enums'

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string

  @IsString()
  @IsOptional()
  @ApiProperty()
  description: string = ''

  @IsEnum(PlaylistType)
  @ApiProperty({
    enum: PlaylistType,
  })
  type: PlaylistType
}
