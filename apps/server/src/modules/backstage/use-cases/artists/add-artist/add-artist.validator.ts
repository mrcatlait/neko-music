import { Injectable } from '@nestjs/common'

import { AddArtistUseCaseParams } from './add-artist.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'

@Injectable()
export class AddArtistValidator implements Validator<AddArtistUseCaseParams> {
  constructor(private readonly databaseService: DatabaseService) {}

  async validate(params: AddArtistUseCaseParams): Promise<ValidationResult> {
    const [nameTaken, genresExist] = await Promise.all([
      this.databaseService.sql<{ exists: boolean }[]>`
        SELECT EXISTS(SELECT 1 FROM "catalog"."Artist" WHERE "name" = ${params.name})
      `.then((result) => result.at(0)?.exists ?? false),
      this.databaseService.sql<{ exists: boolean }[]>`
        SELECT EXISTS(SELECT 1 FROM "catalog"."Genre" WHERE "id" IN ${this.databaseService.sql(params.genres)})
      `.then((result) => result.at(0)?.exists ?? false),
    ])

    const errors: string[] = []

    if (nameTaken) {
      errors.push('Artist name already taken')
    }

    if (!genresExist) {
      errors.push('Genres not found')
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
      }
    }

    return {
      isValid: true,
    }
  }
}
