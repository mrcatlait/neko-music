import { BadRequestException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { CreateArtistCommand } from './create-artist.command'
import { CreateArtistValidator } from './create-artist.validator'
import { ArtistGenreRepository, ArtistRepository } from '../../repositories'
import { ArtistEntity } from '../../entities'

import { DatabaseService } from '@modules/database'

@CommandHandler(CreateArtistCommand)
export class CreateArtistHandler implements ICommandHandler<CreateArtistCommand, ArtistEntity> {
  constructor(
    private readonly createArtistValidator: CreateArtistValidator,
    private readonly artistRepository: ArtistRepository,
    private readonly artistGenreRepository: ArtistGenreRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async execute(command: CreateArtistCommand): Promise<ArtistEntity> {
    const validationResult = await this.createArtistValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.databaseService.sql.begin(async (transaction) => {
      const artist = await this.artistRepository.create(
        {
          name: command.name,
          verified: command.verified,
        },
        transaction,
      )

      await this.artistGenreRepository.createMany(artist.id, command.genres, transaction)

      return artist
    })
  }
}
