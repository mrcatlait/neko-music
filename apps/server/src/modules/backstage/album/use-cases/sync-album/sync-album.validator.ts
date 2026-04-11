import { BadRequestException, Injectable } from '@nestjs/common'

import { SyncAlbumUseCaseParams } from './sync-album.use-case'
import { AlbumRepository } from '../../repositories'
import { PublishingStatus } from '../../../shared/enums'

import { Validator } from '@/modules/shared/types'
import { GetMediaReadinessUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

@Injectable()
export class SyncAlbumValidator implements Validator<SyncAlbumUseCaseParams> {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly getMediaReadinessUseCase: GetMediaReadinessUseCase,
  ) {}

  async validate(params: SyncAlbumUseCaseParams): Promise<void> {
    const album = await this.albumRepository.findOne(params.albumId)

    if (!album) {
      throw new BadRequestException(`Album ${params.albumId} not found`)
    }

    if (album.status !== PublishingStatus.Review && album.status !== PublishingStatus.Published) {
      throw new BadRequestException('Album is not ready for publishing')
    }

    const mediaReadiness = await this.getMediaReadinessUseCase.invoke({
      entityType: EntityType.Album,
      entityId: params.albumId,
    })

    if (!mediaReadiness.ready) {
      throw new BadRequestException(`Media file for album ${params.albumId} is not ready`)
    }
  }
}
