import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, Min } from 'class-validator'

export class UpdatePlaylistTracksDto {
  @IsNumber()
  @Min(0)
  @ApiProperty()
  rangeStart: number

  @IsNumber()
  @Min(0)
  @ApiProperty()
  rangeEnd: number

  @IsNumber()
  @Min(0)
  @ApiProperty()
  insertBefore: number
}
