import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { AlbumArtistEntity } from '../entities'

import { DatabaseService } from '@/modules/database/services'

@Injectable()
export class AlbumArtistRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends AlbumArtistEntity>(artist: Type, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "catalog"."AlbumArtist" ("albumId", "artistId")
      VALUES (${artist.albumId}, ${artist.artistId})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(artists: AlbumArtistEntity[], sql?: Sql): Promise<AlbumArtistEntity[]> {
    if (artists.length === 0) {
      return Promise.resolve([])
    }

    return (sql ?? this.databaseService.sql)<AlbumArtistEntity[]>`
      INSERT INTO "catalog"."AlbumArtist" ${this.databaseService.sql(artists)}
      RETURNING *
    `
  }

  delete(artist: Omit<AlbumArtistEntity, 'position'>): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "catalog"."AlbumArtist" WHERE "albumId" = ${artist.albumId} AND "artistId" = ${artist.artistId}
    `.then(() => undefined)
  }

  deleteMany(artists: Omit<AlbumArtistEntity, 'position'>[]): Promise<void> {
    if (artists.length === 0) {
      return Promise.resolve()
    }

    return this.databaseService.sql`
      DELETE FROM "catalog"."AlbumArtist" ${this.databaseService.sql(artists)}
    `.then(() => undefined)
  }
}
