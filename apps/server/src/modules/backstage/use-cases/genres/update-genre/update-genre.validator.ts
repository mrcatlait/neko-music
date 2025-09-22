import { Injectable } from '@nestjs/common'

import { UpdateGenreUseCaseParams } from './update-genre.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'

@Injectable()
export class UpdateGenreValidator implements Validator<UpdateGenreUseCaseParams> {
  constructor(private readonly databaseService: DatabaseService) {}

  async validate(params: UpdateGenreUseCaseParams): Promise<ValidationResult> {
    const genreExists = await this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "catalog"."Genre" WHERE id = ${params.id})
    `.then((result) => result.at(0)?.exists ?? false)

    if (!genreExists) {
      return {
        isValid: false,
        errors: ['Genre not found'],
      }
    }

    const nameTaken = await this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "catalog"."Genre" WHERE name = ${params.name} AND id != ${params.id})
    `.then((result) => result.at(0)?.exists ?? false)

    if (nameTaken) {
      return {
        isValid: false,
        errors: ['Name already taken'],
      }
    }

    return {
      isValid: true,
    }
  }
}
