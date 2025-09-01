import { Injectable } from '@nestjs/common'

import { AddGenreUseCaseParams } from './add-genre.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'

@Injectable()
export class AddGenreValidator implements Validator<AddGenreUseCaseParams> {
  constructor(private readonly databaseService: DatabaseService) {}

  async validate(params: AddGenreUseCaseParams): Promise<ValidationResult> {
    const genreExists = await this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "catalog"."Genre" WHERE name = ${params.name})
    `.then((result) => result.at(0)?.exists ?? false)

    if (genreExists) {
      return {
        isValid: false,
        errors: ['Genre already exists'],
      }
    }

    return {
      isValid: true,
    }
  }
}
