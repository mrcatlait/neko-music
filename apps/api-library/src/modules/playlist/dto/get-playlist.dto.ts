import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class GetPlaylistDto {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty()
  readonly playlistId: string
}
