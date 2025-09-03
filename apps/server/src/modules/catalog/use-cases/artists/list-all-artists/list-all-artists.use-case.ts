import { Injectable } from '@nestjs/common'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'
import { ArtistEntity } from '@/modules/catalog/entities'

export type ListAllArtistsUseCaseResult = ArtistEntity[]

@Injectable()
export class ListAllArtistsUseCase implements UseCase<never, ListAllArtistsUseCaseResult> {
  constructor(private readonly databaseService: DatabaseService) {}

  invoke(): Promise<ListAllArtistsUseCaseResult> {
    return this.databaseService.sql<ListAllArtistsUseCaseResult>`
      SELECT * FROM "catalog"."Artist"
    `.then((result) => result)
  }
}
