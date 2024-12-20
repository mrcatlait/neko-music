import { ApiProperty } from '@nestjs/swagger'

import { PlaylistType } from '../enums'

import { ImageDto } from '@modules/shared/dtos'

export class PlaylistDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly name: string

  @ApiProperty({
    enum: PlaylistType,
  })
  readonly type: PlaylistType

  @ApiProperty({
    type: [ImageDto],
  })
  readonly images: ImageDto[]
}
