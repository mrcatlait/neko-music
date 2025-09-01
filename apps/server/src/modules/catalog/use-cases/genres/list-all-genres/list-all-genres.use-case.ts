import { Injectable } from '@nestjs/common'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'
import { GenreEntity } from '@/modules/catalog/entities'

export type ListAllGenresUseCaseResult = GenreEntity[]

@Injectable()
export class ListAllGenresUseCase implements UseCase<never, ListAllGenresUseCaseResult> {
  constructor(private readonly databaseService: DatabaseService) {}

  invoke(): Promise<ListAllGenresUseCaseResult> {
    return this.databaseService.sql<ListAllGenresUseCaseResult>`
      SELECT * FROM "catalog"."Genre"
    `.then((result) => result)
  }
}
