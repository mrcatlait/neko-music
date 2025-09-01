import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

import { RecordStatus } from '../enums'

export class GenreResponse implements Contracts.CatalogManagement.GenreResponse {
  @ApiProperty({
    description: 'The id of the genre',
  })
  id: string

  @ApiProperty({
    description: 'The name of the genre',
  })
  name: string

  @ApiProperty({
    description: 'The status of the genre',
    enum: RecordStatus,
  })
  status: RecordStatus
}
