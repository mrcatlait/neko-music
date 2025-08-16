import { ApiProperty } from '@nestjs/swagger'

export class Artwork {
  @ApiProperty({
    description: 'The URL of the artwork',
    example: 'https://example.com/artwork.jpg',
  })
  url: string

  @ApiProperty({
    description: 'The height of the artwork',
    example: 100,
  })
  height: number

  @ApiProperty({
    description: 'The width of the artwork',
    example: 100,
  })
  width: number

  @ApiProperty({
    description: 'The dominant color of the artwork',
    example: '#000000',
  })
  dominantColor: string
}
