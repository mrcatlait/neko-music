import { BadRequestException, Injectable } from '@nestjs/common'
import { File } from '@nest-lab/fastify-multer'

import { AddArtistValidator } from './add-artist.validator'
import { GetArtistByIdUseCase } from '../get-artist-by-id'

import { DatabaseService } from '@/modules/database'
import { UseCase } from '@/modules/shared/interfaces'
import { ArtistEntity, ArtistGenreEntity } from '@/modules/catalog/entities'

export interface AddArtistUseCaseParams {
  readonly name: string
  readonly genres: string[]
  readonly artwork: File
}

export type AddArtistUseCaseResult = ArtistEntity

@Injectable()
export class AddArtistUseCase implements UseCase<AddArtistUseCaseParams, AddArtistUseCaseResult> {
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
        INSERT INTO "catalog"."Artist" ("name", "artwork")
        VALUES (${params.name})
        RETURNING *
      `.then((result) => result.at(0)!)

      await transaction<ArtistGenreEntity[]>`
        INSERT INTO "catalog"."ArtistGenre" ("artistId", "genreId")
        VALUES (${artist.id}, ${params.genres})
        RETURNING *
      `

      

      return artist.id
    })

    return this.getArtistByIdUseCase.invoke({ id: artistId })
  }
}
