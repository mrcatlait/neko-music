import { BadRequestException, Injectable } from '@nestjs/common'

import { PublishAlbumValidator } from './publish-album.validator'

import { UseCase } from '@/modules/shared/interfaces'
import { AlbumRepository, ArtistRepository, TrackRepository } from '@/modules/backstage/repositories'
import { CreateCatalogAlbumUseCase } from '@/modules/catalog/use-cases'
import { GetArtworkUseCase } from '@/modules/media/use-cases'
import { EntityType } from '@/modules/media/enums'

export interface PublishAlbumUseCaseParams {
  readonly userId: string
  readonly albumId: string
}

export type PublishAlbumUseCaseResult = void

@Injectable()
export class PublishAlbumUseCase implements UseCase<PublishAlbumUseCaseParams, PublishAlbumUseCaseResult> {
  constructor(
    private readonly publishAlbumValidator: PublishAlbumValidator,
    private readonly albumRepository: AlbumRepository,
    private readonly artistRepository: ArtistRepository,
    private readonly createCatalogAlbumUseCase: CreateCatalogAlbumUseCase,
    private readonly getArtworkUseCase: GetArtworkUseCase,
  ) {}

  async invoke(params: PublishAlbumUseCaseParams): Promise<PublishAlbumUseCaseResult> {
    const validationResult = await this.publishAlbumValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const album = await this.albumRepository.findAlbumWithGenresAndArtistsById(params.albumId)
    if (!album) {
      throw new BadRequestException(['Album not found'])
    }

    const catalogArtistIds: { artistId: string; role: string }[] = []
    for (const { artistId, role } of album.artists) {
      const backstageArtist = await this.artistRepository.findArtistById(artistId)
      if (!backstageArtist?.catalogArtistId) {
        throw new BadRequestException([`Artist ${artistId} is not published; all album artists must be published`])
      }
      catalogArtistIds.push({ artistId: backstageArtist.catalogArtistId, role })
    }

    const artwork = await this.getArtworkUseCase.invoke({
      entityType: EntityType.ALBUM,
      entityId: params.albumId,
    })

    const catalogAlbum = await this.createCatalogAlbumUseCase.invoke({
      name: album.name,
      releaseDate: album.releaseDate,
      explicit: album.explicit,
      type: album.type,
      artwork,
      genres: album.genres,
      artists: catalogArtistIds,
    })

    await this.albumRepository.publishAlbum(params.albumId, catalogAlbum.id, params.userId)
  }
}
