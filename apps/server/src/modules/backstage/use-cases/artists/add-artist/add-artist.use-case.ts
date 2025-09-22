import { BadRequestException, Injectable } from '@nestjs/common'

import { AddArtistValidator } from './add-artist.validator'
import { GetArtistByIdUseCase } from '../get-artist-by-id'

import { DatabaseService } from '@/modules/database'
import { UseCase } from '@/modules/shared/interfaces'
import { ArtistEntity, ArtistGenreEntity } from '@/modules/catalog/entities'
import { ArtworkEntity, WithArtwork } from '@/modules/shared/entities'

export interface AddArtistUseCaseParams {
  readonly name: string
  readonly genres: string[]
}

export type AddArtistUseCaseResult = WithArtwork<ArtistEntity>

@Injectable()
export class AddArtistUseCase implements UseCase<AddArtistUseCaseParams, AddArtistUseCaseResult> {
  private readonly placeholderArtwork: ArtworkEntity = {
    url: 'https://placehold.co/600x400',
    sizes: ['small', 'medium', 'large'],
    dominantColor: '#000000',
  }

  constructor(
    private readonly addArtistValidator: AddArtistValidator,
    private readonly databaseService: DatabaseService,
    private readonly getArtistByIdUseCase: GetArtistByIdUseCase,
  ) {}

  async invoke(params: AddArtistUseCaseParams): Promise<AddArtistUseCaseResult> {
    const validationResult = await this.addArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const artistId = await this.databaseService.sql.begin(async (transaction) => {
      const artist = await transaction<ArtistEntity[]>`
        INSERT INTO "catalog"."Artist" ("name")
        VALUES (${params.name})
        RETURNING *
      `.then((result) => result.at(0)!)

      await Promise.all([
        transaction<ArtworkEntity[]>`
        INSERT INTO "catalog"."ArtistArtwork" ("artistId", "url", "sizes", "dominantColor")
        VALUES (${artist.id}, ${this.placeholderArtwork.url}, ${this.placeholderArtwork.sizes}, ${this.placeholderArtwork.dominantColor})
        RETURNING *
      `.then((result) => result.at(0)!),

        transaction<ArtistGenreEntity[]>`
        INSERT INTO "catalog"."ArtistGenre" ("artistId", "genreId")
        VALUES (${artist.id}, ${params.genres})
        RETURNING *
      `.then(() => undefined),
      ])

      return artist.id
    })

    return this.getArtistByIdUseCase.invoke({ id: artistId })
  }
}
