import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator'

export class AddPlaylistTrackDto {
  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  @IsUUID(4, { each: true })
  readonly tracks: string[]
}
