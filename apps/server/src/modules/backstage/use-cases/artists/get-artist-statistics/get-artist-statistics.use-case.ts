import { Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../../repositories'
import { ArtistStatisticsEntity } from '../../../entities'

import { UseCase } from '@/modules/shared/interfaces'

export type GetArtistStatisticsUseCaseResult = ArtistStatisticsEntity[]

@Injectable()
export class GetArtistStatisticsUseCase implements UseCase<void, GetArtistStatisticsUseCaseResult> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  invoke(): Promise<ArtistStatisticsEntity[]> {
    return this.artistRepository.getArtistStatistics()
  }
}
