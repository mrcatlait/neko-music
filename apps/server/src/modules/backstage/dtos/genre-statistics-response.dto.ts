import { ApiProperty } from '@nestjs/swagger'
import { Contracts } from '@neko/contracts'

import { GenreStatistics } from './genre-statistics.dto'

export class GenreStatisticsResponse implements Contracts.Backstage.GenreStatisticsResponse {
  @ApiProperty({
    description: 'The genre statistics',
    type: [GenreStatistics],
  })
  data: GenreStatistics[]
}
