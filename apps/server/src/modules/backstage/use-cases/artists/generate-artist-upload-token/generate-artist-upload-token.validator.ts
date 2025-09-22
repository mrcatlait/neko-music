import { Injectable } from '@nestjs/common'

import { GenerateArtistUploadTokenUseCaseParams } from './generate-artist-upload-token.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database/services'

@Injectable()
export class GenerateArtistUploadTokenValidator implements Validator<GenerateArtistUploadTokenUseCaseParams> {
  constructor(private readonly databaseService: DatabaseService) {}

  async validate(params: GenerateArtistUploadTokenUseCaseParams): Promise<ValidationResult> {
    const artistExists = await this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "catalog"."Artist" WHERE id = ${params.artistId})
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
