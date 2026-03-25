import { Contracts } from '@neko/contracts'
import { ApiProperty } from '@nestjs/swagger'

import { Genre } from './genre.dto'

import { PagePaginationMetadata } from '@/modules/shared/dtos'

export class GenreListResponse implements Contracts.Backstage.GenreListResponse {
  @ApiProperty({
    description: 'The genres',
    type: [Genre],
  })
  data: Genre[]

  @ApiProperty({
    description: 'The metadata',
    type: PagePaginationMetadata,
  })
  metadata: PagePaginationMetadata

  constructor(data: Genre[], metadata: PagePaginationMetadata) {
    this.data = data
    this.metadata = metadata
  }
}
