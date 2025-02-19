import { Injectable } from '@nestjs/common'

import { DatabaseService } from '@modules/database'

import { ArtistEntity } from '../entities'

@Injectable()
export class ArtistRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  getById(id: string): Promise<ArtistEntity | undefined> {
    return this.databaseService.sql<ArtistEntity[]>`
      SELECT * FROM "music"."Artist" WHERE id = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  getByName(name: string): Promise<ArtistEntity | undefined> {
    return this.databaseService.sql<ArtistEntity[]>`
      SELECT * FROM "music"."Artist" WHERE name = ${name}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  create(artist: Omit<ArtistEntity, 'id' | 'created_at' | 'updated_at'>): Promise<ArtistEntity> {
    return this.databaseService.sql<ArtistEntity[]>`
      INSERT INTO "music"."Artist" (name, verified)
      VALUES (${artist.name}, ${artist.verified})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  update(artist: Omit<ArtistEntity, 'created_at' | 'updated_at'>): Promise<ArtistEntity> {
    return this.databaseService.sql<ArtistEntity[]>`
      UPDATE "music"."Artist" SET name = ${artist.name}, verified = ${artist.verified}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${artist.id}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "music"."Artist" WHERE id = ${id}
    `.then(() => undefined)
  }
}
