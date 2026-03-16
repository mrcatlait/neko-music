import { Injectable } from '@nestjs/common'
import { Contracts } from '@neko/contracts'

import { CreateBackstageTrackValidator } from './create-backstage-track.validator'

import { UseCase } from '@/modules/shared/interfaces'

export type CreateBackstageTrackUseCaseParams = {
  readonly name: string
  readonly albumId: string
  readonly releaseDate: Date
  readonly diskNumber: number
  readonly trackNumber: number
  readonly type: Contracts.Shared.TrackType
  readonly explicit: boolean
  readonly genres: string[]
  readonly artists: {
    readonly id: string
    readonly role: Contracts.Shared.ArtistRole
  }[]
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
    const validationResult = await this.createBackstageTrackValidator.validate(params)

    if (!validationResult.isValid) {
      throw new Error(validationResult.error)
    }

    const track = await this.trackRepository.createTrackWithGenresAndArtists(params)

    return { id: track.id }
  }
}
