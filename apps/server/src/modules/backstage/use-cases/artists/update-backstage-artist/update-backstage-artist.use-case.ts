import { Injectable } from '@nestjs/common'

import { UpdateBackstageArtistValidator } from './update-backstage-artist.validator'
import { ArtistRepository } from '../../../repositories'
import { SyncArtistUseCase } from '../sync-artist'

import { UseCase } from '@/modules/shared/types'
import { PublishingStatus } from '@/modules/backstage/enums'

export interface UpdateBackstageArtistUseCaseParams {
  readonly id: string
  readonly name: string
  readonly genres: string[]
  readonly verified: boolean
}

@Injectable()
export class UpdateBackstageArtistUseCase implements UseCase<UpdateBackstageArtistUseCaseParams, void> {
  constructor(
    private readonly updateBackstageArtistValidator: UpdateBackstageArtistValidator,
    private readonly artistRepository: ArtistRepository,
    private readonly syncArtistUseCase: SyncArtistUseCase,
  ) {}

  async invoke(params: UpdateBackstageArtistUseCaseParams): Promise<void> {
    await this.updateBackstageArtistValidator.validate(params)

    const artist = await this.artistRepository.updateWithGenres(params.id, {
      artist: {
        name: params.name,
        verified: params.verified,
      },
      genres: params.genres,
    })

    if (artist.status === PublishingStatus.Published) {
      await this.syncArtistUseCase.invoke({
        artistId: artist.id,
      })
    }
  }
}
