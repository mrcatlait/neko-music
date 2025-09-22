import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdateArtistValidator } from './update-artist.validator'
import { GetArtistByIdUseCase } from '../get-artist-by-id'

import { DatabaseService } from '@/modules/database'
import { UseCase } from '@/modules/shared/interfaces'
import { ArtistEntity, ArtistGenreEntity } from '@/modules/catalog/entities'
import { WithArtwork } from '@/modules/shared/entities'

export interface UpdateArtistUseCaseParams {
  readonly id: string
  readonly name: string
  readonly genres: string[]
}

export type UpdateArtistUseCaseResult = WithArtwork<ArtistEntity>

@Injectable()
export class UpdateArtistUseCase implements UseCase<UpdateArtistUseCaseParams, UpdateArtistUseCaseResult> {
  constructor(
    private readonly updateArtistValidator: UpdateArtistValidator,
    private readonly databaseService: DatabaseService,
    private readonly getArtistByIdUseCase: GetArtistByIdUseCase,
  ) {}

  async invoke(params: UpdateArtistUseCaseParams): Promise<UpdateArtistUseCaseResult> {
    const validationResult = await this.updateArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    await this.databaseService.sql.begin(async (transaction) => {
      await transaction<ArtistEntity[]>`
        UPDATE "catalog"."Artist" 
        SET name = ${params.name}
        WHERE id = ${params.id}
        RETURNING *
      `.then(() => undefined)

      await transaction<ArtistGenreEntity[]>`
        DELETE FROM "catalog"."ArtistGenre" WHERE "artistId" = ${params.id}
      `.then(() => undefined)

      await transaction<ArtistGenreEntity[]>`
        INSERT INTO "catalog"."ArtistGenre" ("artistId", "genreId")
        VALUES (${params.id}, ${params.genres})
        RETURNING *
      `.then(() => undefined)
    })

    return this.getArtistByIdUseCase.invoke({ id: params.id })
  }
}
