import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator'

import { Privacy } from '../models'

export class CreatePlaylistDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string

  @IsOptional()
  @Matches(`^${[Privacy.PRIVATE, Privacy.PUBLIC].join('|')}$`, 'i')
  @ApiProperty({
    enum: Privacy,
  })
  readonly privacy: Privacy
}
