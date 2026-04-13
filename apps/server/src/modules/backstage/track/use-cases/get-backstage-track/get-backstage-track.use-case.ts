import { Injectable, NotFoundException } from '@nestjs/common'
import { Selectable } from 'kysely'

import { TrackRepository } from '../../repositories'
import { BackstageTrackTable } from '../../../backstage.schema'

import { UseCase } from '@/modules/shared/types'

export interface GetBackstageTrackUseCaseParams {
  readonly id: string
}

export type GetBackstageTrackUseCaseResult = Selectable<BackstageTrackTable>

@Injectable()
export class GetBackstageTrackUseCase implements UseCase<
  GetBackstageTrackUseCaseParams,
  GetBackstageTrackUseCaseResult
> {
  constructor(private readonly trackRepository: TrackRepository) {}

  invoke(params: GetBackstageTrackUseCaseParams): Promise<GetBackstageTrackUseCaseResult> {
    return this.trackRepository.findOne(params.id).then((track) => {
      if (!track) {
        throw new NotFoundException('Track not found')
      }

      return track
    })
  }
}
