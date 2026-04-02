import { Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../repositories'

import { Artwork, UseCase } from '@/modules/shared/types'

export interface UpdateCatalogArtistUseCaseParams {
  id: string
  name: string
  genres: string[]
  verified: boolean
  artwork: Artwork
}

export type UpdateCatalogArtistUseCaseResult = void

@Injectable()
export class UpdateCatalogArtistUseCase implements UseCase<
  UpdateCatalogArtistUseCaseParams,
  UpdateCatalogArtistUseCaseResult
> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async invoke(params: UpdateCatalogArtistUseCaseParams): Promise<UpdateCatalogArtistUseCaseResult> {
    const exists = await this.artistRepository.exists(params.id)

    if (exists) {
      await this.artistRepository.delete(params.id)
    }

    await this.artistRepository.create({
      id: params.id,
      name: params.name,
      verified: params.verified,
      artwork: params.artwork,
    })
  }
}
