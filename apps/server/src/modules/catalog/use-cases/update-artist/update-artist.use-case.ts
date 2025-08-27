import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'

import { ArtistGenreRepository, ArtistRepository } from '../../repositories'
import { ArtistEntity } from '../../entities'
import { UpdateArtistValidator } from './update-artist.validator'

import { DatabaseService } from '@/modules/database'

export interface UpdateArtistUseCaseParams {
  readonly id: string
  readonly name: string
  readonly genres: string[] | null
}

@Injectable()
export class UpdateArtistUseCase {
  constructor(
    private readonly updateArtistValidator: UpdateArtistValidator,
    private readonly artistRepository: ArtistRepository,
    private readonly artistGenreRepository: ArtistGenreRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async invoke(params: UpdateArtistUseCaseParams): Promise<ArtistEntity> {
    const validationResult = await this.updateArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.databaseService.sql.begin(async (transaction) => {
      const artist = await this.artistRepository.find(params.id, transaction)

      if (!artist) {
        throw new NotFoundException('Artist not found')
      }

      await this.artistRepository.update(
        {
          ...artist,
          name: params.name,
        },
        transaction,
      )

      if (params.genres) {
        await this.artistGenreRepository.deleteManyByArtistId(artist.id, transaction)
        await this.artistGenreRepository.createMany(artist.id, params.genres, transaction)
      }

      return artist
    })
  }
}
