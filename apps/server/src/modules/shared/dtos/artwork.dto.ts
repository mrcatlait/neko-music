import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

export class ArtworkDto implements Contracts.Shared.Artwork {
  @ApiProperty({
    description: 'Template URL with {size} placeholder; use preset names (small, medium, large)',
    example: 'https://example.com/artwork/{size}.webp',
  })
  readonly url: string

  @ApiProperty({
    description: 'Available preset names matching image transform presets',
    example: ['small', 'medium', 'large'],
  })
  readonly sizes: string[]

  @ApiProperty({
    description: 'Background color as hex',
    example: '000000',
  })
  readonly bgColor: string

  @ApiProperty({
    description: 'Primary text color for contrast (hex)',
    required: false,
  })
  readonly textColor1?: string

  @ApiProperty({ required: false })
  readonly textColor2?: string

  @ApiProperty({ required: false })
  readonly textColor3?: string

  @ApiProperty({ required: false })
  readonly textColor4?: string
}
