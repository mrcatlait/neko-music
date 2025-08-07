import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { AlbumArtistEntity } from '../entities'

import { DatabaseService } from '@/modules/database/services'

@Injectable()
export class AlbumArtistRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends AlbumArtistEntity>(artist: Type, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "music"."AlbumArtist" (album_id, artist_id)
      VALUES (${artist.albumId}, ${artist.artistId})
      RETURNING
        album_id as "albumId",
        artist_id as "artistId",
        position
    `.then((result) => result.at(0)!)
  }

  createMany(artists: AlbumArtistEntity[], sql?: Sql): Promise<AlbumArtistEntity[]> {
    if (artists.length === 0) {
      return Promise.resolve([])
    }

    return (sql ?? this.databaseService.sql)<AlbumArtistEntity[]>`
      INSERT INTO "music"."AlbumArtist" ${this.databaseService.sql(artists)}
      RETURNING
        album_id as "albumId",
        artist_id as "artistId",
        position
    `
  }

  delete(artist: Omit<AlbumArtistEntity, 'position'>): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "music"."AlbumArtist" WHERE album_id = ${artist.albumId} AND artist_id = ${artist.artistId}
    `.then(() => undefined)
  }

  deleteMany(artists: Omit<AlbumArtistEntity, 'position'>[]): Promise<void> {
    if (artists.length === 0) {
      return Promise.resolve()
    }

    return this.databaseService.sql`
      DELETE FROM "music"."AlbumArtist" ${this.databaseService.sql(artists)}
    `.then(() => undefined)
  }
}
