import { ApiProperty } from '@nestjs/swagger'

export class ArtworkDto {
  @ApiProperty({
    description: 'The URL of the artwork',
    example: 'https://example.com/artwork.jpg',
  })
  url: string

  @ApiProperty({
    description: 'The background color of the artwork',
    example: '#000000',
  })
  backgroundColor: string

  @ApiProperty({
    description: 'The text color of the artwork',
    example: '#ffffff',
  })
  textColor: string
}
