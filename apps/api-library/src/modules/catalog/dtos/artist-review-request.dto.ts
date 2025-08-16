import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { RecordStatus } from '../enums'

export class ArtistReviewRequest {
  @IsEnum(RecordStatus)
  @ApiProperty({
    description: 'The publishing status of the artist',
    example: RecordStatus.DRAFT,
    enum: RecordStatus,
  })
  status: RecordStatus
}
