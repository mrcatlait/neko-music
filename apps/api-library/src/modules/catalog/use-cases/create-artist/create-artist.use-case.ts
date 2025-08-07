import { BadRequestException, Injectable } from '@nestjs/common'
import { DatabaseService } from '@/modules/database'

import { CreateArtistValidator } from './create-artist.validator'
import { ArtistGenreRepository, ArtistRepository } from '../../repositories'
import { ArtistEntity } from '../../entities'

export interface CreateArtistUseCaseParams {
  readonly name: string
  readonly verified: boolean
  readonly genres: string[]
}

@Injectable()
export class CreateArtistUseCase {
  constructor(
    private readonly createArtistValidator: CreateArtistValidator,
    private readonly artistRepository: ArtistRepository,
    private readonly artistGenreRepository: ArtistGenreRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async invoke(params: CreateArtistUseCaseParams): Promise<ArtistEntity> {
    const validationResult = await this.createArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.databaseService.sql.begin(async (transaction) => {
      const artist = await this.artistRepository.create(
        {
          name: params.name,
          verified: params.verified,
        },
        transaction,
      )

      await this.artistGenreRepository.createMany(artist.id, params.genres, transaction)

      return artist
    })
  }
}
