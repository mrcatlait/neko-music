import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class AddPlaylistTrackDto {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty()
  readonly trackId: string
}
