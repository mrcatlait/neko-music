import { Injectable } from '@nestjs/common'

import { SyncArtistUseCaseParams } from './sync-artist.use-case'

import { ArtistRepository } from '@/modules/backstage/repositories'
import { ValidationResult, Validator } from '@/modules/shared/interfaces'
import { GetMediaReadinessUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'
import { PublishingStatus } from '@/modules/backstage/enums'

@Injectable()
export class SyncArtistValidator implements Validator<SyncArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly getMediaReadinessUseCase: GetMediaReadinessUseCase,
  ) {}

  async validate(params: SyncArtistUseCaseParams): Promise<ValidationResult> {
    const artist = await this.artistRepository.findArtistById(params.artistId)

    if (!artist) {
      return {
        isValid: false,
        error: `Artist ${params.artistId} not found`,
      }
    }

    if (artist.status === PublishingStatus.Processing) {
      return {
        isValid: false,
        error: `Artist ${params.artistId} is processing`,
      }
    }

    const mediaReadiness = await this.getMediaReadinessUseCase.invoke({
      entityType: EntityType.Artist,
      entityId: params.artistId,
    })

    if (!mediaReadiness.ready) {
      return {
        isValid: false,
        error: `Media file for artist ${params.artistId} is not ready`,
      }
    }

    return { isValid: true }
  }
}
