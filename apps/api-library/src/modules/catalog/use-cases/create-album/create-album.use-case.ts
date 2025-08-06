import { BadRequestException, Injectable } from '@nestjs/common'

import { AlbumEntity } from '../../entities'
import { CreateAlbumValidator } from './create-album.validator'
import { AlbumArtistRepository, AlbumGenreRepository, AlbumRepository } from '../../repositories'
import { AlbumType } from '../../enums'

import { DatabaseService } from '@modules/database'

export interface CreateAlbumUseCaseParams {
  readonly name: string
  readonly releaseDate: Date
  readonly explicit: boolean
  readonly type: AlbumType
  readonly genres: string[]
  readonly artists: string[]
}

@Injectable()
export class CreateAlbumUseCase {
  constructor(
    private readonly createAlbumValidator: CreateAlbumValidator,
    private readonly albumRepository: AlbumRepository,
    private readonly albumGenreRepository: AlbumGenreRepository,
    private readonly albumArtistRepository: AlbumArtistRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async invoke(params: CreateAlbumUseCaseParams): Promise<AlbumEntity> {
    const validationResult = await this.createAlbumValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.databaseService.sql.begin(async (transaction) => {
      const album = await this.albumRepository.create(
        {
          name: params.name,
          releaseDate: params.releaseDate,
          explicit: params.explicit,
          type: params.type,
        },
        transaction,
      )

      await Promise.all([
        this.albumGenreRepository.createMany(
          params.genres.map((genre, index) => ({
            albumId: album.id,
            genreId: genre,
            position: index,
          })),
          transaction,
        ),
        this.albumArtistRepository.createMany(
          params.artists.map((artist, index) => ({
            albumId: album.id,
            artistId: artist,
            position: index,
          })),
          transaction,
        ),
      ])

      return album
    })
  }
}
