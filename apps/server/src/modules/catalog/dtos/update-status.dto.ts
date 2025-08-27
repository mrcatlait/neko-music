import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

import { RecordStatus } from '../enums'

export class UpdateStatusDto {
  @IsEnum(RecordStatus)
  @ApiProperty({
    description: 'The publishing status of the record',
    example: RecordStatus.DRAFT,
    enum: RecordStatus,
  })
  status: RecordStatus
}
