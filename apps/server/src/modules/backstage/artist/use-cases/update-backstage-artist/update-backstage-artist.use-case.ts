import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { UpdateBackstageArtistValidator } from './update-backstage-artist.validator'
import { ArtistRepository } from '../../repositories'
import { SyncArtistUseCase } from '../sync-artist'
import { PublishingStatus } from '../../../shared/enums'
import { BackstageArtistTable } from '../../../backstage.schema'

import { UseCase } from '@/modules/shared/types'

export interface UpdateBackstageArtistUseCaseParams {
  readonly id: string
  readonly name: string
  readonly genres: string[]
  readonly verified: boolean
  readonly userId: string
}

export type UpdateBackstageArtistUseCaseResult = Selectable<BackstageArtistTable>

@Injectable()
export class UpdateBackstageArtistUseCase implements UseCase<
  UpdateBackstageArtistUseCaseParams,
  UpdateBackstageArtistUseCaseResult
> {
  constructor(
    private readonly updateBackstageArtistValidator: UpdateBackstageArtistValidator,
    private readonly artistRepository: ArtistRepository,
    private readonly syncArtistUseCase: SyncArtistUseCase,
  ) {}

  async invoke(params: UpdateBackstageArtistUseCaseParams): Promise<UpdateBackstageArtistUseCaseResult> {
    await this.updateBackstageArtistValidator.validate(params)

    const artist = await this.artistRepository.updateWithGenres(params.id, {
      name: params.name,
      verified: params.verified,
      updatedBy: params.userId,
      updatedAt: new Date(),
      genres: params.genres,
    })

    if (artist.status === PublishingStatus.Published) {
      await this.syncArtistUseCase.invoke({
        artistId: artist.id,
      })
    }

    return artist
  }
}
