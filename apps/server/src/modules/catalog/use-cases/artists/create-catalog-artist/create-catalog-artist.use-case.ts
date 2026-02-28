import { BadRequestException, Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { CreateCatalogArtistValidator } from './create-catalog-artist.validator'
import { ArtistRepository } from '../../../repositories'

import { Artwork, UseCase } from '@/modules/shared/interfaces'
import { CatalogArtistTable } from '@/modules/database'

export interface CreateCatalogArtistUseCaseParams {
  readonly name: string
  readonly genres: string[]
  readonly verified: boolean
  readonly artwork: Artwork
}

export type CreateCatalogArtistUseCaseResult = Selectable<CatalogArtistTable>

@Injectable()
export class CreateCatalogArtistUseCase implements UseCase<
  CreateCatalogArtistUseCaseParams,
  CreateCatalogArtistUseCaseResult
> {
  constructor(
    private readonly createCatalogArtistValidator: CreateCatalogArtistValidator,
    private readonly artistRepository: ArtistRepository,
  ) {}

  async invoke(params: CreateCatalogArtistUseCaseParams): Promise<CreateCatalogArtistUseCaseResult> {
    const validationResult = await this.createCatalogArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return await this.artistRepository.createArtist({
      artist: {
        name: params.name,
        verified: params.verified,
        artwork: params.artwork,
      },
      genres: params.genres,
    })
  }
}
