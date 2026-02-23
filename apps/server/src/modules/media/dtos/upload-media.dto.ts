import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

export class UploadMediaDto implements Contracts.Media.UploadMediaResponse {
  @ApiProperty({
    description: 'The processing job ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  processingJobId: string
}
