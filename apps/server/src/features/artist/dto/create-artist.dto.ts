import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString } from 'class-validator'

import { LinkDto } from './link.dto'

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string

  @IsArray()
  @ApiProperty({ type: () => [LinkDto] })
  readonly links: LinkDto[]

  @ApiProperty({ type: 'string', format: 'binary' })
  image: string
}
