import { Injectable } from '@nestjs/common'

import { TrackRepository } from '../../repositories'
import { UpdateBackstageTrackPlaybackValidator } from './update-backstage-track-playback.validator'
import { ProcessBackstageTrackLifecycleUseCase } from '../process-backstage-track-lifecycle'

import { UseCase } from '@/modules/shared/types'
import { EntityType } from '@/modules/media/enums'
import { GetPlaybackUseCase } from '@/modules/media/use-cases'
import { ProcessBackstageAlbumLifecycleUseCase } from '@/modules/backstage/album/use-cases'

export interface UpdateBackstageTrackPlaybackUseCaseParams {
  readonly id: string
}

export type UpdateBackstageTrackPlaybackUseCaseResult = void

@Injectable()
export class UpdateBackstageTrackPlaybackUseCase implements UseCase<
  UpdateBackstageTrackPlaybackUseCaseParams,
  UpdateBackstageTrackPlaybackUseCaseResult
> {
  constructor(
    private readonly updateBackstageTrackPlaybackValidator: UpdateBackstageTrackPlaybackValidator,
    private readonly trackRepository: TrackRepository,
    private readonly getPlaybackUseCase: GetPlaybackUseCase,
    private readonly processBackstageTrackLifecycleUseCase: ProcessBackstageTrackLifecycleUseCase,
    private readonly processBackstageAlbumLifecycleUseCase: ProcessBackstageAlbumLifecycleUseCase,
  ) {}

  async invoke(params: UpdateBackstageTrackPlaybackUseCaseParams): Promise<UpdateBackstageTrackPlaybackUseCaseResult> {
    await this.updateBackstageTrackPlaybackValidator.validate(params)

    const playback = await this.getPlaybackUseCase.invoke({
      entityType: EntityType.Track,
      entityId: params.id,
    })

    const track = await this.trackRepository.update(params.id, {
      playback,
    })

    await this.processBackstageTrackLifecycleUseCase.invoke({
      trackId: params.id,
    })

    await this.processBackstageAlbumLifecycleUseCase.invoke({
      albumId: track.albumId,
    })
  }
}
