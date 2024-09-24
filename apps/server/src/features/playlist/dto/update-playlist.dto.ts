import { ApiProperty } from '@nestjs/swagger'

export class UpdatePlaylistDto {
  @ApiProperty()
  readonly name?: string

  @ApiProperty()
  readonly addSong?: string
}
