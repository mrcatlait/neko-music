import { BadRequestException, Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { CreateCatalogAlbumValidator } from './create-catalog-album.validator'
import { AlbumRepository } from '../../../repositories'

import { Artwork, UseCase } from '@/modules/shared/interfaces'
import { CatalogAlbumTable } from '@/modules/database'
import { AlbumType } from '@/modules/catalog/enums'

export interface CreateCatalogAlbumUseCaseParams {
  readonly name: string
  readonly releaseDate: Date
  readonly explicit: boolean
  readonly type: AlbumType
  readonly artwork: Artwork
  readonly genres: string[]
  readonly artists: { artistId: string; role: ArtistRole }[]
}

export type CreateCatalogAlbumUseCaseResult = Selectable<CatalogAlbumTable>

@Injectable()
export class CreateCatalogAlbumUseCase implements UseCase<
  CreateCatalogAlbumUseCaseParams,
  CreateCatalogAlbumUseCaseResult
> {
  constructor(
    private readonly createCatalogAlbumValidator: CreateCatalogAlbumValidator,
    private readonly albumRepository: AlbumRepository,
  ) {}

  async invoke(params: CreateCatalogAlbumUseCaseParams): Promise<CreateCatalogAlbumUseCaseResult> {
    const validationResult = await this.createCatalogAlbumValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return await this.albumRepository.createAlbum({
      album: {
        name: params.name,
        releaseDate: params.releaseDate,
        explicit: params.explicit,
        type: params.type,
        artwork: params.artwork,
      },
      genres: params.genres,
      artists: params.artists,
    })
  }
}
