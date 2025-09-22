import { Injectable } from '@nestjs/common'

import { RemoveGenreUseCaseParams } from './remove-genre.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'

@Injectable()
export class RemoveGenreValidator implements Validator<RemoveGenreUseCaseParams> {
  constructor(private readonly databaseService: DatabaseService) {}

  async validate(params: RemoveGenreUseCaseParams): Promise<ValidationResult> {
    const genreExists = await this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "catalog"."Genre" WHERE id = ${params.id})
    `.then((result) => result.at(0)?.exists ?? false)

    if (!genreExists) {
      return {
        isValid: false,
        errors: ['Genre not found'],
      }
    }

    return {
      isValid: true,
    }
  }
}
