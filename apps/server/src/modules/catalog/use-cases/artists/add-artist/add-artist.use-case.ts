import { BadRequestException, Injectable } from '@nestjs/common'

import { AddArtistValidator } from './add-artist.validator'
import { ArtistGenreRepository, ArtistRepository } from '../../../repositories'
import { ArtistEntity } from '../../../entities'
import { RecordStatus } from '../../../enums'

import { DatabaseService } from '@/modules/database'

export interface AddArtistUseCaseParams {
  readonly name: string
  readonly genres: string[]
}

@Injectable()
export class AddArtistUseCase {
  constructor(
    private readonly addArtistValidator: AddArtistValidator,
    private readonly artistRepository: ArtistRepository,
    private readonly artistGenreRepository: ArtistGenreRepository,
    private readonly databaseService: DatabaseService,
  ) {}

  async invoke(params: AddArtistUseCaseParams): Promise<ArtistEntity> {
    const validationResult = await this.addArtistValidator.validate(params)

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
