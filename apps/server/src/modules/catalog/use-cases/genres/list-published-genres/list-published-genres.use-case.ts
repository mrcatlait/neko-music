import { Injectable } from '@nestjs/common'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'
import { GenreEntity } from '@/modules/catalog/entities'
import { RecordStatus } from '@/modules/catalog/enums'

export type ListPublishedGenresUseCaseResult = GenreEntity[]

@Injectable()
export class ListPublishedGenresUseCase implements UseCase<never, ListPublishedGenresUseCaseResult> {
  constructor(private readonly databaseService: DatabaseService) {}

  invoke(): Promise<ListPublishedGenresUseCaseResult> {
    return this.databaseService.sql<ListPublishedGenresUseCaseResult>`
      SELECT * FROM "catalog"."Genre" WHERE status = ${RecordStatus.PUBLISHED}
    `.then((result) => result)
  }
}
