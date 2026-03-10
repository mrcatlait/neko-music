import { ApiProperty } from '@nestjs/swagger'
import { Contracts } from '@neko/contracts'

import { ArtistStatistics } from './artist-statistics.dto'

export class ArtistStatisticsResponse implements Contracts.Backstage.ArtistStatisticsResponse {
  @ApiProperty({
    description: 'The artist statistics',
    type: [ArtistStatistics],
  })
  data: ArtistStatistics[]
}
