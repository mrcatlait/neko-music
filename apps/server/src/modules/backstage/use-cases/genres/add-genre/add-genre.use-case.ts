import { BadRequestException, Injectable } from '@nestjs/common'

import { AddGenreValidator } from './add-genre.validator'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'
import { GenreEntity } from '@/modules/catalog/entities'

export interface AddGenreUseCaseParams {
  readonly name: string
}

export type AddGenreUseCaseResult = GenreEntity

@Injectable()
export class AddGenreUseCase implements UseCase<AddGenreUseCaseParams, AddGenreUseCaseResult> {
  constructor(
    private readonly addGenreValidator: AddGenreValidator,
    private readonly databaseService: DatabaseService,
  ) {}

  async invoke(params: AddGenreUseCaseParams): Promise<AddGenreUseCaseResult> {
    const validationResult = await this.addGenreValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.databaseService.sql<GenreEntity[]>`
      INSERT INTO "catalog"."Genre" (name)
      VALUES (${params.name})
      RETURNING *
    `.then((result) => result.at(0)!)
  }
}
