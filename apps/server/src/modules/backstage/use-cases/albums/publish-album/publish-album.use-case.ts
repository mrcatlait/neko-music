import { BadRequestException, Injectable } from '@nestjs/common'

import { PublishAlbumValidator } from './publish-album.validator'

import { UseCase } from '@/modules/shared/types'
import { AlbumRepository, ArtistRepository } from '@/modules/backstage/repositories'
import { CreateCatalogAlbumUseCase } from '@/modules/catalog/use-cases'
import { GetArtworkUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'
import { AlbumType } from '@/modules/catalog/enums'

export interface PublishAlbumUseCaseParams {
  readonly userId: string
  readonly albumId: string
}

@Injectable()
export class PublishAlbumUseCase implements UseCase<PublishAlbumUseCaseParams, void> {
  constructor(
    private readonly publishAlbumValidator: PublishAlbumValidator,
    private readonly albumRepository: AlbumRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly createCatalogAlbumUseCase: CreateCatalogAlbumUseCase,
    private readonly getArtworkUseCase: GetArtworkUseCase,
  ) {}

  async invoke(params: PublishAlbumUseCaseParams): Promise<void> {
    await this.publishAlbumValidator.validate(params)

    const album = await this.albumRepository.findAlbumWithGenresAndArtistsById(params.albumId)

    if (!album) {
      throw new BadRequestException(['Album not found'])
    }

    const catalogArtistIds: { artistId: string; role: string }[] = []
    for (const { artistId, role } of album.artists) {
      const backstageArtist = await this.artistRepository.findOne(artistId)
      if (!backstageArtist?.catalogArtistId) {
        throw new BadRequestException([`Artist ${artistId} is not published; all album artists must be published`])
      }
      catalogArtistIds.push({ artistId: backstageArtist.catalogArtistId, role })
    }

    const artwork = await this.getArtworkUseCase.invoke({
      entityType: EntityType.Album,
      entityId: params.albumId,
    })

    const catalogAlbum = await this.createCatalogAlbumUseCase.invoke({
      name: album.name,
      releaseDate: album.releaseDate,
      explicit: album.explicit,
      type: AlbumType.Album,
      artwork,
      genres: album.genres,
      artists: catalogArtistIds,
    })

    await this.albumRepository.publishAlbum(params.albumId, catalogAlbum.id)
  }
}
