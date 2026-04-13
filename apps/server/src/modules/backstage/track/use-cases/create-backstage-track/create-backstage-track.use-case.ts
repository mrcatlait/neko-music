import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { CreateBackstageTrackValidator } from './create-backstage-track.validator'
import { TrackRepository } from '../../repositories'
import { PublishingStatus } from '../../../shared/enums'
import { BackstageTrackTable } from '../../../backstage.schema'
import { ProcessBackstageTrackLifecycleUseCase } from '../process-backstage-track-lifecycle'

import { UseCase } from '@/modules/shared/types'
import { TrackType } from '@/modules/shared/enums'

export interface CreateBackstageTrackUseCaseParams {
  readonly name: string
  readonly albumId: string
  readonly trackNumber: number
  readonly diskNumber: number
  readonly releaseDate: Date
  readonly type: TrackType
  readonly explicit: boolean
  readonly genres: string[]
  readonly userId: string
}

export type CreateBackstageTrackUseCaseResult = Selectable<BackstageTrackTable>

@Injectable()
export class CreateBackstageTrackUseCase implements UseCase<
  CreateBackstageTrackUseCaseParams,
  CreateBackstageTrackUseCaseResult
> {
  constructor(
    private readonly createBackstageTrackValidator: CreateBackstageTrackValidator,
    private readonly trackRepository: TrackRepository,
    private readonly processBackstageTrackLifecycleUseCase: ProcessBackstageTrackLifecycleUseCase,
  ) {}

  async invoke(params: CreateBackstageTrackUseCaseParams): Promise<CreateBackstageTrackUseCaseResult> {
    await this.createBackstageTrackValidator.validate(params)

    const track = await this.trackRepository.createWithGenres({
      name: params.name,
      status: PublishingStatus.Draft,
      albumId: params.albumId,
      trackNumber: params.trackNumber,
      diskNumber: params.diskNumber,
      releaseDate: params.releaseDate,
      type: params.type,
      explicit: params.explicit,
      createdBy: params.userId,
      updatedBy: params.userId,
      genres: params.genres,
    })

    await this.processBackstageTrackLifecycleUseCase.invoke({ trackId: track.id })

    return track
  }
}
