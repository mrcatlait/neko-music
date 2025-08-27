import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateArtistValidator } from './create-artist.validator'
import { ArtistGenreRepository, ArtistRepository } from '../../repositories'
import { ArtistEntity } from '../../entities'
import { RecordStatus } from '../../enums'

import { DatabaseService } from '@/modules/database'

export interface CreateArtistUseCaseParams {
  readonly name: string
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
          verified: false,
          status: RecordStatus.DRAFT,
        },
        transaction,
      )

      await this.artistGenreRepository.createMany(artist.id, params.genres, transaction)

      return artist
    })
  }
}
