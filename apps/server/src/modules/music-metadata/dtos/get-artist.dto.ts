import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class GetArtistDto {
  @IsUUID(4)
  @IsNotEmpty()
  @ApiProperty()
  readonly artistId: string
}
