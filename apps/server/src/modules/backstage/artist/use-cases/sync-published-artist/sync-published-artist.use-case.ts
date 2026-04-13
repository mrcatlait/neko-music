import { Injectable } from '@nestjs/common'

import { SyncPublishedArtistValidator } from './sync-published-artist.validator'
import { GetBackstageArtistUseCase } from '../get-backstage-artist'

import { UseCase } from '@/modules/shared/types'

export interface SyncPublishedArtistUseCaseParams {
  readonly artistId: string
}

export type SyncPublishedArtistUseCaseResult = void

@Injectable()
export class SyncPublishedArtistUseCase implements UseCase<
  SyncPublishedArtistUseCaseParams,
  SyncPublishedArtistUseCaseResult
> {
  constructor(
    private readonly syncPublishedArtistValidator: SyncPublishedArtistValidator,
    private readonly getBackstageArtistUseCase: GetBackstageArtistUseCase,
  ) {}

  async invoke(params: SyncPublishedArtistUseCaseParams): Promise<SyncPublishedArtistUseCaseResult> {
    await this.syncPublishedArtistValidator.validate(params)

    const artist = await this.getBackstageArtistUseCase.invoke({ id: params.artistId })

    return
  }
}
