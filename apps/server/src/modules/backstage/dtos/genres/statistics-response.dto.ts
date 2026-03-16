import { ApiProperty } from '@nestjs/swagger'
import { Contracts } from '@neko/contracts'

import { GenreStatistics } from './statistics.dto'

export class GenreStatisticsResponse implements Contracts.Backstage.Genres.StatisticsResponse {
  @ApiProperty({
    description: 'The genre statistics',
    type: [GenreStatistics],
  })
  data: GenreStatistics[]
}
