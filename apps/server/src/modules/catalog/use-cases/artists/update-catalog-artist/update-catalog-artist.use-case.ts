import { Injectable } from '@nestjs/common'

import { UpdateCatalogArtistValidator } from './update-catalog-artist.validator'
import { ArtistRepository } from '../../../repositories'

import { Artwork, UseCase } from '@/modules/shared/interfaces'

export interface UpdateCatalogArtistUseCaseParams {
  readonly id: string
  readonly name: string
  readonly genres: string[]
  readonly verified: boolean
  readonly artwork: Artwork
}

@Injectable()
export class UpdateCatalogArtistUseCase implements UseCase<UpdateCatalogArtistUseCaseParams, void> {
  constructor(
    private readonly updateCatalogArtistValidator: UpdateCatalogArtistValidator,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async invoke(params: UpdateCatalogArtistUseCaseParams): Promise<void> {
    const validationResult = await this.updateCatalogArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new Error(validationResult.error)
    }

    await this.artistRepository.updateArtist({
      artist: {
        id: params.id,
        name: params.name,
        verified: params.verified,
        artwork: params.artwork,
      },
      genres: params.genres,
    })
  }
}
