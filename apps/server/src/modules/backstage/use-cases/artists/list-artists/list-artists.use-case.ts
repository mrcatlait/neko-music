import { Injectable } from '@nestjs/common'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'
import { ArtistEntity } from '@/modules/catalog/entities'

export type ListArtistsUseCaseResult = { data: ArtistEntity[] }

@Injectable()
export class ListArtistsUseCase implements UseCase<never, ListArtistsUseCaseResult> {
  constructor(private readonly databaseService: DatabaseService) {}

  invoke(): Promise<ListArtistsUseCaseResult> {
    return this.databaseService.sql<ArtistEntity[]>`
      SELECT *
      FROM "catalog"."Artist"
    `.then((result) => ({ data: result }))
  }
}
