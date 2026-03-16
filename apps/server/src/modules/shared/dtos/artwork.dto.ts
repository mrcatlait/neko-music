import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

export class ArtworkDto implements Contracts.Shared.Dtos.Artwork {
  @ApiProperty({
    description: 'Template URL with {size} placeholder; use preset names (small, medium, large)',
    example: 'https://example.com/artwork/{size}.webp',
  })
  readonly url: string

  @ApiProperty({
    description: 'Dominant color of the artwork',
    example: '#000000',
  })
  readonly dominantColor: string
}
