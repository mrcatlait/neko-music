import { BadRequestException, Injectable } from '@nestjs/common'

import { RemoveGenreValidator } from './remove-genre.validator'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'

export interface RemoveGenreUseCaseParams {
  readonly id: string
}

@Injectable()
export class RemoveGenreUseCase implements UseCase<RemoveGenreUseCaseParams, void> {
  constructor(
    private readonly removeGenreValidator: RemoveGenreValidator,
    private readonly databaseService: DatabaseService,
  ) {}

  async invoke(params: RemoveGenreUseCaseParams): Promise<void> {
    const validationResult = await this.removeGenreValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.databaseService.sql`
      DELETE FROM "catalog"."Genre"
      WHERE id = ${params.id}
    `.then(() => undefined)
  }
}
