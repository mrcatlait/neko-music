import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

export class UploadTokenDto implements Contracts.Media.UploadTokenResponse {
  @ApiProperty({
    description: 'The upload token',
  })
  uploadToken: string
}
