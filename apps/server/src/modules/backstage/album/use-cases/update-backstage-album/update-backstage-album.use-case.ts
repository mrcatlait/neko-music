import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { AlbumRepository } from '../../repositories'
import { BackstageAlbumTable } from '../../../backstage.schema'
import { UpdateBackstageAlbumValidator } from './update-backstage-album.validator'
import { PublishingStatus } from '../../../shared/enums'
import { ProcessBackstageAlbumLifecycleUseCase } from '../process-backstage-album-lifecycle'
import { ProcessLinkedBackstageTracksUseCase } from '../process-linked-backstage-tracks'

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
    private readonly processBackstageAlbumLifecycleUseCase: ProcessBackstageAlbumLifecycleUseCase,
    private readonly processLinkedBackstageTracksUseCase: ProcessLinkedBackstageTracksUseCase,
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

    await this.processBackstageAlbumLifecycleUseCase.invoke({
      albumId: album.id,
    })

    await this.processLinkedBackstageTracksUseCase.invoke({ albumId: album.id })

    return album
  }
}
