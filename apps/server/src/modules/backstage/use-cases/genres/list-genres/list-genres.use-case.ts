import { Injectable } from '@nestjs/common'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'
import { GenreEntity } from '@/modules/catalog/entities'

export type ListGenresUseCaseResult = {
  data: GenreEntity[]
}

@Injectable()
export class ListGenresUseCase implements UseCase<never, ListGenresUseCaseResult> {
  constructor(private readonly databaseService: DatabaseService) {}

  invoke(): Promise<ListGenresUseCaseResult> {
    return this.databaseService.sql<GenreEntity[]>`
      SELECT * FROM "catalog"."Genre"
    `.then((result) => ({ data: result }))
  }
}
