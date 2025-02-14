import { ApiProperty } from '@nestjs/swagger'

import { ImageDto } from '@modules/shared/dtos'

export class ArtistDto {
  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly name: string

  @ApiProperty()
  readonly bio?: string

  @ApiProperty({ type: () => [ImageDto] })
  readonly images?: ImageDto[]
}
