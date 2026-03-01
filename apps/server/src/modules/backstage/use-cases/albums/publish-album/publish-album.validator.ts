import { Injectable } from '@nestjs/common'

import { PublishAlbumUseCaseParams } from './publish-album.use-case'

import { AlbumRepository, TrackRepository } from '@/modules/backstage/repositories'
import { ValidationResult, Validator } from '@/modules/shared/interfaces'
import { PublishingStatus } from '@/modules/backstage/enums'
import { GetMediaReadinessUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

@Injectable()
export class PublishAlbumValidator implements Validator<PublishAlbumUseCaseParams> {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly trackRepository: TrackRepository,
    private readonly getMediaReadinessUseCase: GetMediaReadinessUseCase,
  ) {}

  async validate(params: PublishAlbumUseCaseParams): Promise<ValidationResult> {
    const album = await this.albumRepository.findAlbumById(params.albumId)

    if (!album) {
      return {
        isValid: false,
        errors: ['Album not found'],
      }
    }

    if (album.status === PublishingStatus.PUBLISHED) {
      return {
        isValid: false,
        errors: ['Album is already published'],
      }
    }

    const trackCount = await this.trackRepository.countTracksByAlbumId(params.albumId)
    if (trackCount < 1) {
      return {
        isValid: false,
        errors: ['Album must have at least one track to be published'],
      }
    }

    const mediaReadiness = await this.getMediaReadinessUseCase.invoke({
      entityType: EntityType.ALBUM,
      entityId: params.albumId,
    })

    if (!mediaReadiness.ready) {
      return {
        isValid: false,
        errors: ['Media file is not ready'],
      }
    }

    return {
      isValid: true,
    }
  }
}
