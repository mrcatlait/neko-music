import { Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../repositories'
import { UpdateBackstageArtistArtworkValidator } from './update-backstage-artist-artwork.validator'
import { SyncArtistUseCase } from '../sync-artist'

import { UseCase } from '@/modules/shared/types'
import { EntityType } from '@/modules/media/enums'
import { GetArtworkUseCase } from '@/modules/media/use-cases'

export interface UpdateBackstageArtistArtworkUseCaseParams {
  readonly id: string
}

export type UpdateBackstageArtistArtworkUseCaseResult = void

@Injectable()
export class UpdateBackstageArtistArtworkUseCase implements UseCase<
  UpdateBackstageArtistArtworkUseCaseParams,
  UpdateBackstageArtistArtworkUseCaseResult
> {
  constructor(
    private readonly updateBackstageArtistArtworkValidator: UpdateBackstageArtistArtworkValidator,
    private readonly artistRepository: ArtistRepository,
    private readonly getArtworkUseCase: GetArtworkUseCase,
    private readonly syncArtistUseCase: SyncArtistUseCase,
  ) {}

  async invoke(params: UpdateBackstageArtistArtworkUseCaseParams): Promise<UpdateBackstageArtistArtworkUseCaseResult> {
    await this.updateBackstageArtistArtworkValidator.validate(params)

    const artwork = await this.getArtworkUseCase.invoke({
      entityType: EntityType.Artist,
      entityId: params.id,
    })

    await this.artistRepository.update(params.id, {
      artwork,
    })

    await this.syncArtistUseCase.invoke({
      artistId: params.id,
    })
  }
}
