import { BadRequestException, Injectable } from '@nestjs/common'

import { RemoveArtistValidator } from './remove-artist.validator'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'

export interface RemoveArtistUseCaseParams {
  readonly id: string
}

@Injectable()
export class RemoveArtistUseCase implements UseCase<RemoveArtistUseCaseParams, void> {
  constructor(
    private readonly removeArtistValidator: RemoveArtistValidator,
    private readonly databaseService: DatabaseService,
  ) {}

  async invoke(params: RemoveArtistUseCaseParams): Promise<void> {
    const validationResult = await this.removeArtistValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.databaseService.sql`
      DELETE FROM "catalog"."Artist" WHERE id = ${params.id}
    `.then(() => undefined)
  }
}
