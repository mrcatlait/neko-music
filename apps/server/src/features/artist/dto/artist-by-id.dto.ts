import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID } from 'class-validator'

export class ArtistByIdDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  readonly artistId: string
}
