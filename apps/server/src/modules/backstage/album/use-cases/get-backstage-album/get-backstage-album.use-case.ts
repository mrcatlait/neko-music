import { Injectable, NotFoundException } from '@nestjs/common'
import { Selectable } from 'kysely'

import { AlbumRepository } from '../../repositories'
import { BackstageAlbumTable } from '../../../backstage.schema'

import { UseCase } from '@/modules/shared/types'

export interface GetBackstageAlbumUseCaseParams {
  readonly id: string
}

export type GetBackstageAlbumUseCaseResult = Selectable<BackstageAlbumTable>

@Injectable()
export class GetBackstageAlbumUseCase implements UseCase<
  GetBackstageAlbumUseCaseParams,
  GetBackstageAlbumUseCaseResult
> {
  constructor(private readonly albumRepository: AlbumRepository) {}

  invoke(params: GetBackstageAlbumUseCaseParams): Promise<GetBackstageAlbumUseCaseResult> {
    return this.albumRepository.findOne(params.id).then((album) => {
      if (!album) {
        throw new NotFoundException('Album not found')
      }

      return album
    })
  }
}
