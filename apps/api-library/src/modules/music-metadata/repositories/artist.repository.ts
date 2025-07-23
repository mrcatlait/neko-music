import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { ArtistEntity, WithArtwork } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class ArtistRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findOne<Type extends WithArtwork<ArtistEntity>>(id: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      SELECT 
        id,
        name,
        verified,
        artwork
      FROM "music"."Artist" 
      WHERE id = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  exists(name: string): Promise<boolean> {
    return this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "music"."Artist" WHERE name = ${name})
    `.then((result) => result.at(0)?.exists ?? false)
  }

  existsAll(ids: string[]): Promise<boolean> {
    return this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "music"."Artist" WHERE id IN ${this.databaseService.sql(ids)})
    `.then((result) => result.at(0)?.exists ?? false)
  }

  create<Type extends ArtistEntity>(artist: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "music"."Artist" (name, verified)
      VALUES (${artist.name}, ${artist.verified})
      RETURNING 
        id,
        name,
        verified
    `.then((result) => result.at(0)!)
  }

  update<Type extends ArtistEntity>(artist: Type, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      UPDATE "music"."Artist" 
      SET name = ${artist.name}, verified = ${artist.verified}
      WHERE id = ${artist.id}
      RETURNING 
        id,
        name,
        verified,
        artwork,
        media_file_id as "mediaFileId"
    `.then((result) => result.at(0)!)
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "music"."Artist" WHERE id = ${id}
    `.then(() => undefined)
  }
}
