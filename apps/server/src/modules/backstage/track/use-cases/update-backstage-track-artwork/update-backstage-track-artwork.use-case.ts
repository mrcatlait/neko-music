import { Injectable } from '@nestjs/common'

import { TrackRepository } from '../../repositories'
import { UpdateBackstageTrackArtworkValidator } from './update-backstage-track-artwork.validator'
import { ProcessBackstageTrackLifecycleUseCase } from '../process-backstage-track-lifecycle'

import { Artwork, UseCase } from '@/modules/shared/types'
import { ProcessBackstageAlbumLifecycleUseCase } from '@/modules/backstage/album/use-cases'

export interface UpdateBackstageTrackArtworkUseCaseParams {
  readonly id: string
  readonly artwork: Artwork
}

export type UpdateBackstageTrackArtworkUseCaseResult = void

@Injectable()
export class UpdateBackstageTrackArtworkUseCase implements UseCase<
  UpdateBackstageTrackArtworkUseCaseParams,
  UpdateBackstageTrackArtworkUseCaseResult
> {
  constructor(
    private readonly updateBackstageTrackArtworkValidator: UpdateBackstageTrackArtworkValidator,
    private readonly trackRepository: TrackRepository,
    private readonly processBackstageTrackLifecycleUseCase: ProcessBackstageTrackLifecycleUseCase,
    private readonly processBackstageAlbumLifecycleUseCase: ProcessBackstageAlbumLifecycleUseCase,
  ) {}

  async invoke(params: UpdateBackstageTrackArtworkUseCaseParams): Promise<UpdateBackstageTrackArtworkUseCaseResult> {
    await this.updateBackstageTrackArtworkValidator.validate(params)

    const track = await this.trackRepository.update(params.id, {
      artwork: params.artwork,
    })

    await this.processBackstageTrackLifecycleUseCase.invoke({
      trackId: params.id,
    })

    await this.processBackstageAlbumLifecycleUseCase.invoke({
      albumId: track.albumId,
    })
  }
}
