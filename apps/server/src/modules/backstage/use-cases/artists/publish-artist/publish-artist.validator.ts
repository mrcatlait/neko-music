import { Injectable } from '@nestjs/common'

import { PublishArtistUseCaseParams } from './publish-artist.use-case'

import { ArtistRepository } from '@/modules/backstage/repositories'
import { ValidationResult, Validator } from '@/modules/shared/interfaces'
import { PublishingStatus } from '@/modules/backstage/enums'
import { GetMediaReadinessUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

@Injectable()
export class PublishArtistValidator implements Validator<PublishArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly getMediaReadinessUseCase: GetMediaReadinessUseCase,
  ) {}

  async validate(params: PublishArtistUseCaseParams): Promise<ValidationResult> {
    const artist = await this.artistRepository.findArtistById(params.artistId)

    if (!artist) {
      return {
        isValid: false,
        error: `Artist ${params.artistId} not found`,
      }
    }

    if (artist.status === PublishingStatus.PUBLISHED) {
      return {
        isValid: false,
        error: `Artist ${params.artistId} is already published`,
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

    return {
      isValid: true,
    }
  }
}
