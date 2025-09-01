import { BadRequestException, Injectable } from '@nestjs/common'

import { PublishGenreValidator } from './publish-genre.validator'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'
import { RecordStatus } from '@/modules/catalog/enums'

export interface PublishGenreUseCaseParams {
  readonly id: string
}

@Injectable()
export class PublishGenreUseCase implements UseCase<PublishGenreUseCaseParams, void> {
  constructor(
    private readonly publishGenreValidator: PublishGenreValidator,
    private readonly databaseService: DatabaseService,
  ) {}

  async invoke(params: PublishGenreUseCaseParams): Promise<void> {
    const validationResult = await this.publishGenreValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.databaseService
      .sql`UPDATE "catalog"."Genre" SET status = ${RecordStatus.PUBLISHED} WHERE id = ${params.id}`.then(
      () => undefined,
    )
  }
}
