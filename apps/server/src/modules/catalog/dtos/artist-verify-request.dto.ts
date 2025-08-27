import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean } from 'class-validator'

export class ArtistVerifyRequest {
  @IsBoolean()
  @ApiProperty({
    description: 'The verified status of the artist',
    example: true,
  })
  verified: boolean
}
