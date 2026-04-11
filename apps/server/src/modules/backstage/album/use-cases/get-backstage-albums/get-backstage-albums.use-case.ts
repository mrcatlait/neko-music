import { Injectable } from '@nestjs/common'

import { BackstageAlbumTable } from '../../../backstage.schema'
import { AlbumRepository } from '../../repositories'

import { CursorPaginatedResult, UseCase } from '@/modules/shared/types'

export interface GetBackstageAlbumsUseCaseParams {
  readonly limit?: number
  readonly offset?: number
}

export type GetBackstageAlbumsUseCaseResult = CursorPaginatedResult<BackstageAlbumTable>

@Injectable()
export class GetBackstageAlbumsUseCase implements UseCase<
  GetBackstageAlbumsUseCaseParams,
  GetBackstageAlbumsUseCaseResult
> {
  constructor(private readonly albumRepository: AlbumRepository) {}

  invoke(params: GetBackstageAlbumsUseCaseParams): Promise<GetBackstageAlbumsUseCaseResult> {
    return this.albumRepository.findAll({
      limit: params.limit,
      offset: params.offset,
    })
  }
}
