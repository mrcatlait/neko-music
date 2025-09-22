import { BadRequestException, Injectable } from '@nestjs/common'

import { UpdateGenreValidator } from './update-genre.validator'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'
import { GenreEntity } from '@/modules/catalog/entities'

export interface UpdateGenreUseCaseParams {
  readonly id: string
  readonly name: string
}

export type UpdateGenreUseCaseResult = GenreEntity

@Injectable()
export class UpdateGenreUseCase implements UseCase<UpdateGenreUseCaseParams, UpdateGenreUseCaseResult> {
  constructor(
    private readonly updateGenreValidator: UpdateGenreValidator,
    private readonly databaseService: DatabaseService,
  ) {}

  async invoke(params: UpdateGenreUseCaseParams): Promise<UpdateGenreUseCaseResult> {
    const validationResult = await this.updateGenreValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.databaseService.sql<GenreEntity[]>`
      UPDATE "catalog"."Genre"
      SET name = ${params.name}
      WHERE id = ${params.id}
      RETURNING *
    `.then((result) => result.at(0)!)
  }
}
