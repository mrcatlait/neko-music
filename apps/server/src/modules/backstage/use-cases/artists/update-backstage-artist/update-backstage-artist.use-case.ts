import { Injectable } from '@nestjs/common'

import { UpdateBackstageArtistValidator } from './update-backstage-artist.validator'
import { ArtistRepository } from '../../../repositories'
import { SyncArtistUseCase } from '../sync-artist'

import { UseCase } from '@/modules/shared/interfaces'

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
    const validationResult = await this.updateBackstageArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new Error(validationResult.error)
    }

    const artist = await this.artistRepository.updateArtistWithGenres({
      artist: {
        id: params.id,
        name: params.name,
        verified: params.verified,
      },
      genres: params.genres,
    })

    await this.syncArtistUseCase.invoke({
      artistId: artist.id,
    })
  }
}
