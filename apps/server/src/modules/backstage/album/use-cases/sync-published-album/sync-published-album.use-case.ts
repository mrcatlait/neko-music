import { Injectable } from '@nestjs/common'

import { AlbumRepository } from '../../repositories'
import { PublishingStatus } from '../../../shared/enums'
import { SyncPublishedAlbumValidator } from './sync-published-album.validator'
import { GetBackstageAlbumUseCase } from '../get-backstage-album'

import { UseCase } from '@/modules/shared/types'

export interface SyncPublishedAlbumUseCaseParams {
  readonly albumId: string
}

export type SyncPublishedAlbumUseCaseResult = void

@Injectable()
export class SyncPublishedAlbumUseCase implements UseCase<
  SyncPublishedAlbumUseCaseParams,
  SyncPublishedAlbumUseCaseResult
> {
  constructor(
    private readonly syncPublishedAlbumValidator: SyncPublishedAlbumValidator,
    private readonly albumRepository: AlbumRepository,
    private readonly getBackstageAlbumUseCase: GetBackstageAlbumUseCase,
  ) {}

  async invoke(params: SyncPublishedAlbumUseCaseParams): Promise<SyncPublishedAlbumUseCaseResult> {
    await this.syncPublishedAlbumValidator.validate(params)

    const album = await this.getBackstageAlbumUseCase.invoke({ id: params.albumId })

    if (album.status !== PublishingStatus.Published) {
      await this.albumRepository.update(album.id, {
        status: PublishingStatus.Published,
      })
    }
  }
}
