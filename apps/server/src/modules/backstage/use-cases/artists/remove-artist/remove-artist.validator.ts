import { Injectable } from '@nestjs/common'

import { RemoveArtistUseCaseParams } from './remove-artist.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'

@Injectable()
export class RemoveArtistValidator implements Validator<RemoveArtistUseCaseParams> {
  constructor(private readonly databaseService: DatabaseService) {}

  async validate(params: RemoveArtistUseCaseParams): Promise<ValidationResult> {
    const artistExists = await this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "catalog"."Artist" WHERE id = ${params.id})
    `.then((result) => result.at(0)?.exists ?? false)

    if (!artistExists) {
      return {
        isValid: false,
        errors: ['Artist not found'],
      }
    }

    return {
      isValid: true,
    }
  }
}
