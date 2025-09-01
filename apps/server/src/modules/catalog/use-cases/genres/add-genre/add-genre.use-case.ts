import { BadRequestException, Injectable } from '@nestjs/common'

import { AddGenreValidator } from './add-genre.validator'
import { GenreEntity } from '../../entities'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'

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

    return this.databaseService.sql<AddGenreUseCaseResult[]>`
      INSERT INTO "catalog"."Genre" (name)
      VALUES (${params.name})
      RETURNING *
    `.then((result) => result.at(0)!)
  }
}
