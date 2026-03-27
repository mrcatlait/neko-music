import { Injectable, NotFoundException } from '@nestjs/common'
import { Selectable } from 'kysely'

import { ArtistRepository } from '../../repositories'
import { BackstageArtistTable } from '../../../backstage.schema'

import { UseCase } from '@/modules/shared/types'

export interface GetBackstageArtistUseCaseParams {
  readonly id: string
}

export type GetBackstageArtistUseCaseResult = Selectable<BackstageArtistTable>

@Injectable()
export class GetBackstageArtistUseCase implements UseCase<
  GetBackstageArtistUseCaseParams,
  GetBackstageArtistUseCaseResult
> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  invoke(params: GetBackstageArtistUseCaseParams): Promise<GetBackstageArtistUseCaseResult> {
    return this.artistRepository.findOne(params.id).then((artist) => {
      if (!artist) {
        throw new NotFoundException('Artist not found')
      }

      return artist
    })
  }
}
