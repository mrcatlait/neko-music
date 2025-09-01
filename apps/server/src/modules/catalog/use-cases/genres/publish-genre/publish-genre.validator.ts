import { Injectable } from '@nestjs/common'

import { PublishGenreUseCaseParams } from './publish-genre.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'
import { GenreEntity } from '@/modules/catalog/entities'
import { RecordStatus } from '@/modules/catalog/enums'

@Injectable()
export class PublishGenreValidator implements Validator<PublishGenreUseCaseParams> {
  constructor(private readonly databaseService: DatabaseService) {}

  async validate(params: PublishGenreUseCaseParams): Promise<ValidationResult> {
    const genre = await this.databaseService.sql<GenreEntity[]>`
      SELECT * FROM "catalog"."Genre" WHERE id = ${params.id}
    `.then((result) => result.at(0))

    if (!genre) {
      return {
        isValid: false,
        errors: ['Genre not found'],
      }
    }

    if (genre.status === RecordStatus.PUBLISHED) {
      return {
        isValid: false,
        errors: ['Genre already published'],
      }
    }

    return {
      isValid: true,
    }
  }
}
