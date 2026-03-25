import { Injectable } from '@nestjs/common'

import { BackstageArtistTable } from '../../../backstage.schema'
import { ArtistRepository } from '../../../repositories'

import { CursorPaginatedResult, UseCase } from '@/modules/shared/types'

export interface GetBackstageArtistsUseCaseParams {
  readonly cursor?: string
  readonly limit: number
  readonly query?: string
}

export type GetBackstageArtistsUseCaseResult = CursorPaginatedResult<BackstageArtistTable>

@Injectable()
export class GetBackstageArtistsUseCase implements UseCase<
  GetBackstageArtistsUseCaseParams,
  GetBackstageArtistsUseCaseResult
> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  invoke(params: GetBackstageArtistsUseCaseParams): Promise<GetBackstageArtistsUseCaseResult> {
    return this.artistRepository.search({
      cursor: params.cursor,
      limit: params.limit,
      query: params.query,
    })
  }
}
