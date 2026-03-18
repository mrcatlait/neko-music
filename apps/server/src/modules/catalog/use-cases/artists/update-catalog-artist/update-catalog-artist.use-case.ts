import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { UpdateCatalogArtistValidator } from './update-catalog-artist.validator'
import { ArtistRepository } from '../../../repositories'

import { Artwork, UseCase } from '@/modules/shared/interfaces'
import { CatalogArtistTable } from '@/modules/catalog/catalog.schema'

export interface UpdateCatalogArtistUseCaseParams {
  readonly id: string
  readonly name: string
  readonly genres: string[]
  readonly verified: boolean
  readonly artwork: Artwork
}

export type UpdateCatalogArtistUseCaseResult = Selectable<CatalogArtistTable>

@Injectable()
export class UpdateCatalogArtistUseCase implements UseCase<
  UpdateCatalogArtistUseCaseParams,
  UpdateCatalogArtistUseCaseResult
> {
  constructor(
    private readonly updateCatalogArtistValidator: UpdateCatalogArtistValidator,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async invoke(params: UpdateCatalogArtistUseCaseParams): Promise<UpdateCatalogArtistUseCaseResult> {
    await this.updateCatalogArtistValidator.validate(params)

    return await this.artistRepository.updateArtist({
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
