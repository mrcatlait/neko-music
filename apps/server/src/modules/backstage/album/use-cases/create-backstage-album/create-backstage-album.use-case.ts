import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { AlbumRepository } from '../../repositories'
import { PublishingStatus } from '../../../shared/enums'
import { BackstageAlbumTable } from '../../../backstage.schema'
import { CreateBackstageAlbumValidator } from './create-backstage-album.validator'

import { UseCase } from '@/modules/shared/types'
import { AlbumType } from '@/modules/shared/enums'

export interface CreateBackstageAlbumUseCaseParams {
  readonly name: string
  readonly releaseDate: Date
  readonly explicit: boolean
  readonly type: AlbumType
  readonly genres: string[]
  readonly userId: string
}

export type CreateBackstageAlbumUseCaseResult = Selectable<BackstageAlbumTable>

@Injectable()
export class CreateBackstageAlbumUseCase implements UseCase<
  CreateBackstageAlbumUseCaseParams,
  CreateBackstageAlbumUseCaseResult
> {
  constructor(
    private readonly createBackstageAlbumValidator: CreateBackstageAlbumValidator,
    private readonly albumRepository: AlbumRepository,
  ) {}

  async invoke(params: CreateBackstageAlbumUseCaseParams): Promise<CreateBackstageAlbumUseCaseResult> {
    await this.createBackstageAlbumValidator.validate(params)

    return this.albumRepository.createWithGenres({
      name: params.name,
      status: PublishingStatus.Draft,
      releaseDate: params.releaseDate,
      explicit: params.explicit,
      type: params.type,
      createdBy: params.userId,
      updatedBy: params.userId,
      genres: params.genres,
    })
  }
}
