import { Injectable } from '@nestjs/common'

import { CreateBackstageTrackValidator } from './create-backstage-track.validator'
import { TrackRepository } from '../../../repositories'

import { UseCase } from '@/modules/shared/types'
import { TrackType } from '@/modules/shared/enums'
import { ArtistRole } from '@/modules/shared/dtos'
import { PublishingStatus } from '@/modules/backstage/enums'

export type CreateBackstageTrackUseCaseParams = {
  readonly name: string
  readonly albumId: string
  readonly releaseDate: Date
  readonly diskNumber: number
  readonly trackNumber: number
  readonly type: TrackType
  readonly explicit: boolean
  readonly genres: string[]
  readonly artists: ArtistRole[]
}

export interface CreateBackstageTrackUseCaseResult {
  readonly id: string
}

@Injectable()
export class CreateBackstageTrackUseCase implements UseCase<
  CreateBackstageTrackUseCaseParams,
  CreateBackstageTrackUseCaseResult
> {
  constructor(
    private readonly createBackstageTrackValidator: CreateBackstageTrackValidator,
    private readonly trackRepository: TrackRepository,
  ) {}

  async invoke(params: CreateBackstageTrackUseCaseParams): Promise<CreateBackstageTrackUseCaseResult> {
    await this.createBackstageTrackValidator.validate(params)

    const track = await this.trackRepository.createTrackWithGenresAndArtists({
      track: {
        name: params.name,
        albumId: params.albumId,
        trackNumber: params.trackNumber,
        diskNumber: params.diskNumber,
        releaseDate: params.releaseDate,
        type: params.type,
        duration: 0,
        explicit: params.explicit,
        status: PublishingStatus.Draft,
      },
      genres: params.genres,
      artists: params.artists,
    })

    return { id: track.id }
  }
}
