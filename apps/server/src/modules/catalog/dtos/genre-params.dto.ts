import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'

import { RecordStatus } from '../enums'

export class GenreParams {
  @ApiPropertyOptional({
    enum: RecordStatus,
    default: RecordStatus.PUBLISHED,
  })
  @IsEnum(RecordStatus)
  @IsOptional()
  status?: RecordStatus
}
