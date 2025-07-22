import { ApiProperty } from '@nestjs/swagger'

export class UploadTokenDto {
  @ApiProperty({
    description: 'The upload token',
  })
  uploadToken: string
}
