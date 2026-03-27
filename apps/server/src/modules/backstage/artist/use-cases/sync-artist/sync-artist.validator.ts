import { BadRequestException, Injectable } from '@nestjs/common'

import { SyncArtistUseCaseParams } from './sync-artist.use-case'
import { ArtistRepository } from '../../repositories'
import { PublishingStatus } from '../../../shared/enums'

import { Validator } from '@/modules/shared/types'
import { GetMediaReadinessUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

@Injectable()
export class SyncArtistValidator implements Validator<SyncArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly getMediaReadinessUseCase: GetMediaReadinessUseCase,
  ) {}

  async validate(params: SyncArtistUseCaseParams): Promise<void> {
    const artist = await this.artistRepository.findOne(params.artistId)

    if (!artist) {
      throw new BadRequestException(`Artist ${params.artistId} not found`)
    }

    if (artist.status !== PublishingStatus.Review && artist.status !== PublishingStatus.Published) {
      throw new BadRequestException('Artist is not ready for publishing')
    }

    const mediaReadiness = await this.getMediaReadinessUseCase.invoke({
      entityType: EntityType.Artist,
      entityId: params.artistId,
    })

    if (!mediaReadiness.ready) {
      throw new BadRequestException(`Media file for artist ${params.artistId} is not ready`)
    }
  }
}
