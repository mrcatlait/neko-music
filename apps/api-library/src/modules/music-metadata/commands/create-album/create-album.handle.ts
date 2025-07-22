import { BadRequestException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { AlbumEntity } from '../../entities'
import { CreateAlbumCommand } from './create-album.command'
import { CreateAlbumValidator } from './create-album.validator'
import { AlbumArtistRepository, AlbumGenreRepository, AlbumRepository } from '../../repositories'

import { DatabaseService } from '@modules/database'

@CommandHandler(CreateAlbumCommand)
export class CreateAlbumHandler implements ICommandHandler<CreateAlbumCommand, void> {
  constructor(
    private readonly createAlbumValidator: CreateAlbumValidator,
    private readonly albumRepository: AlbumRepository,
    private readonly albumGenreRepository: AlbumGenreRepository,
    private readonly albumArtistRepository: AlbumArtistRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async execute(command: CreateAlbumCommand): Promise<AlbumEntity> {
    const validationResult = await this.createAlbumValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.databaseService.sql.begin(async (transaction) => {
      const album = await this.albumRepository.create(
        {
          name: command.name,
          releaseDate: command.releaseDate,
          explicit: command.explicit,
          type: command.type,
        },
        transaction,
      )

      await Promise.all([
        this.albumGenreRepository.createMany(
          command.genres.map((genre, index) => ({
            albumId: album.id,
            genreId: genre,
            position: index,
          })),
          transaction,
        ),
        this.albumArtistRepository.createMany(
          command.artists.map((artist, index) => ({
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
