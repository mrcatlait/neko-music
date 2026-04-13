import { Injectable } from '@nestjs/common'

import { UseCase } from '@/modules/shared/types'
import { TrackRepository } from '@/modules/backstage/track/repositories'
import { ProcessBackstageTrackLifecycleUseCase } from '@/modules/backstage/track/use-cases'

export interface ProcessLinkedBackstageTracksUseCaseParams {
  readonly albumId: string
}

export type ProcessLinkedBackstageTracksUseCaseResult = void

@Injectable()
export class ProcessLinkedBackstageTracksUseCase implements UseCase<
  ProcessLinkedBackstageTracksUseCaseParams,
  ProcessLinkedBackstageTracksUseCaseResult
> {
  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly processBackstageTrackLifecycleUseCase: ProcessBackstageTrackLifecycleUseCase,
  ) {}

  async invoke(params: ProcessLinkedBackstageTracksUseCaseParams): Promise<ProcessLinkedBackstageTracksUseCaseResult> {
    const tracks = await this.trackRepository.findMany({ albumId: params.albumId })

    if (tracks.length === 0) {
      return
    }

    await Promise.all(tracks.map((track) => this.processBackstageTrackLifecycleUseCase.invoke({ trackId: track.id })))
  }
}
