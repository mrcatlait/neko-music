import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

import { PlaylistType } from '../constants'

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string

  @IsOptional()
  @Matches(`^${[PlaylistType.PRIVATE, PlaylistType.PUBLIC].join('|')}$`, 'i')
  @ApiProperty({
    enum: PlaylistType,
  })
  readonly type: PlaylistType
}
