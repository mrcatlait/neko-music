import { ArtistEntity } from '../entities'

import { DatabaseService } from '@common/database'
import { Container } from '@common/di'

export class ArtistRepository {
  private readonly databaseService: DatabaseService

  constructor() {
    this.databaseService = Container.get(DatabaseService)
  }

  getById(id: string): Promise<ArtistEntity | undefined> {
    return this.databaseService.sql<ArtistEntity[]>`
      ${this.selectFragment}
      WHERE a.id = ${id}
      GROUP BY a.id
      LIMIT 1
    `.then((result) => result.at(0))
  }

  private get selectFragment() {
    return this.databaseService.sql<ArtistEntity[]>`
      SELECT a.*,
      array_agg(
        DISTINCT jsonb_build_object(
          'url', ai.url,
          'resolution', ai.resolution
        )
      ) FILTER (WHERE ai.url IS NOT NULL) as images
    FROM "Artist" a
      LEFT JOIN "ArtistImage" ai ON a.id = ai.artist_id
  `
  }
}
