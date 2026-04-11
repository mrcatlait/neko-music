import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { AlbumRepository } from '../../repositories'
import { BackstageAlbumTable } from '../../../backstage.schema'
import { UpdateBackstageAlbumValidator } from './update-backstage-album.validator'
import { SyncAlbumUseCase } from '../sync-album'
import { PublishingStatus } from '../../../shared/enums'

import { Artwork, UseCase } from '@/modules/shared/types'
import { AlbumType } from '@/modules/shared/enums'

export interface UpdateBackstageAlbumUseCaseParams {
  readonly id: string
  readonly name: string
  readonly releaseDate: Date
  readonly explicit: boolean
  readonly type: AlbumType
  readonly genres: string[]
  readonly artwork?: Artwork | null
  readonly status?: PublishingStatus
  readonly userId: string
}

export type UpdateBackstageAlbumUseCaseResult = Selectable<BackstageAlbumTable>

@Injectable()
export class UpdateBackstageAlbumUseCase implements UseCase<
  UpdateBackstageAlbumUseCaseParams,
  UpdateBackstageAlbumUseCaseResult
> {
  constructor(
    private readonly updateBackstageAlbumValidator: UpdateBackstageAlbumValidator,
    private readonly albumRepository: AlbumRepository,
    private readonly syncAlbumUseCase: SyncAlbumUseCase,
  ) {}

  async invoke(params: UpdateBackstageAlbumUseCaseParams): Promise<UpdateBackstageAlbumUseCaseResult> {
    await this.updateBackstageAlbumValidator.validate(params)

    const album = await this.albumRepository.updateWithGenres(params.id, {
      name: params.name,
      releaseDate: params.releaseDate,
      explicit: params.explicit,
      type: params.type,
      artwork: params.artwork ?? undefined,
      status: params.status,
      updatedBy: params.userId,
      updatedAt: new Date(),
      genres: params.genres,
    })

    await this.syncAlbumUseCase.invoke({
      albumId: album.id,
    })

    return album
  }
}
