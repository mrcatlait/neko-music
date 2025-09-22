import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

export class ArtworkDto implements Contracts.Shared.Artwork {
  @ApiProperty({
    description: 'The sizes of the artwork',
    example: ['small', 'medium', 'large'],
  })
  readonly sizes: string[]

  @ApiProperty({
    description: 'The URL of the artwork with placeholder for size',
    example: 'https://example.com/_{size}.jpg',
  })
  readonly url: string

  @ApiProperty({
    description: 'The dominant color of the artwork',
    example: '#000000',
  })
  readonly dominantColor: string
}
