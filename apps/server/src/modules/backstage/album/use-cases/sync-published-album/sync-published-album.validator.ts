import { BadRequestException, Injectable } from '@nestjs/common'

import { AlbumRepository } from '../../repositories'
import { PublishingStatus } from '../../../shared/enums'
import { SyncPublishedAlbumUseCaseParams } from './sync-published-album.use-case'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class SyncPublishedAlbumValidator implements Validator<SyncPublishedAlbumUseCaseParams> {
  constructor(private readonly albumRepository: AlbumRepository) {}

  async validate(params: SyncPublishedAlbumUseCaseParams): Promise<void> {
    const album = await this.albumRepository.findOne(params.albumId)

    if (!album) {
      throw new BadRequestException(`Album ${params.albumId} not found`)
    }

    if (album.status !== PublishingStatus.Review && album.status !== PublishingStatus.Published) {
      throw new BadRequestException('Album is not ready for publishing')
    }
  }
}
