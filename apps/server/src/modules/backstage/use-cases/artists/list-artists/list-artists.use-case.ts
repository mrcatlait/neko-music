import { Injectable } from '@nestjs/common'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'
import { WithArtwork } from '@/modules/shared/entities'
import { ArtistEntity } from '@/modules/catalog/entities'

export type ListArtistsUseCaseResult = { data: WithArtwork<ArtistEntity>[] }

@Injectable()
export class ListArtistsUseCase implements UseCase<never, ListArtistsUseCaseResult> {
  constructor(private readonly databaseService: DatabaseService) {}

  invoke(): Promise<ListArtistsUseCaseResult> {
    return this.databaseService.sql<WithArtwork<ArtistEntity>[]>`
      SELECT
        artist.*,
        jsonb_build_object(
          'url', artwork."url",
          'sizes', artwork."sizes",
          'dominantColor', artwork."dominantColor"
        ) AS "artwork"
      FROM "catalog"."Artist" artist
        LEFT JOIN "catalog"."ArtistArtwork" artwork
          ON artwork."artistId" = artist."id"
    `.then((result) => ({ data: result }))
  }
}
