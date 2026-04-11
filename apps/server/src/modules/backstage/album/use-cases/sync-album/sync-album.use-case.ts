import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { AlbumRepository } from '../../repositories'
import { PublishingStatus } from '../../../shared/enums'
import { SyncAlbumValidator } from './sync-album.validator'
import { GetBackstageAlbumUseCase } from '../get-backstage-album'
import { BackstageAlbumTable } from '../../../backstage.schema'

import { UseCase } from '@/modules/shared/types'

export interface SyncAlbumUseCaseParams {
  readonly albumId: string
}

export type SyncAlbumUseCaseResult = Selectable<BackstageAlbumTable>

@Injectable()
export class SyncAlbumUseCase implements UseCase<SyncAlbumUseCaseParams, SyncAlbumUseCaseResult> {
  constructor(
    private readonly syncAlbumValidator: SyncAlbumValidator,
    private readonly albumRepository: AlbumRepository,
    private readonly getBackstageAlbumUseCase: GetBackstageAlbumUseCase,
  ) {}

  async invoke(params: SyncAlbumUseCaseParams): Promise<SyncAlbumUseCaseResult> {
    await this.syncAlbumValidator.validate(params)

    const album = await this.getBackstageAlbumUseCase.invoke({ id: params.albumId })

    if (album.status !== PublishingStatus.Published) {
      await this.albumRepository.update(album.id, {
        status: PublishingStatus.Published,
      })
    }

    return album
  }
}
