import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { ArtistEntity, WithArtwork, WithArtworkAndMediaFile } from '../entities'

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

  findOneByName<Type extends WithArtwork<ArtistEntity>>(name: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      SELECT 
        id,
        name,
        verified,
        artwork
      FROM "music"."Artist" 
      WHERE name = ${name}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  create<Type extends WithArtworkAndMediaFile<ArtistEntity>>(artist: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    const artwork = JSON.stringify(artist.artwork)

    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "music"."Artist" (name, verified, artwork, media_file_id)
      VALUES (${artist.name}, ${artist.verified}, ${artwork}, ${artist.mediaFileId})
      RETURNING 
        id,
        name,
        verified,
        artwork,
        media_file_id as "mediaFileId"
    `.then((result) => result.at(0)!)
  }

  update<Type extends WithArtworkAndMediaFile<ArtistEntity>>(artist: Type, sql?: Sql): Promise<Type> {
    const artwork = JSON.stringify(artist.artwork)

    return (sql ?? this.databaseService.sql)<Type[]>`
      UPDATE "music"."Artist" 
      SET name = ${artist.name}, verified = ${artist.verified}, artwork = ${artwork}, media_file_id = ${artist.mediaFileId}
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
