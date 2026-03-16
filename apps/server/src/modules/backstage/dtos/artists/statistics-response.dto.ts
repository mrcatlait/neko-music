import { ApiProperty } from '@nestjs/swagger'
import { Contracts } from '@neko/contracts'

import { ArtistStatistics } from './statistics.dto'

export class ArtistStatisticsResponse implements Contracts.Backstage.Artists.StatisticsResponse {
  @ApiProperty({
    description: 'The artist statistics',
    type: [ArtistStatistics],
  })
  data: ArtistStatistics[]
}
