import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { TrackArtistEntity } from '../entities'

import { DatabaseService } from '@/modules/database/services'

@Injectable()
export class TrackArtistRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends TrackArtistEntity>(artist: Type, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "catalog"."TrackArtist" ("trackId", "artistId")
      VALUES (${artist.trackId}, ${artist.artistId})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(artists: TrackArtistEntity[], sql?: Sql): Promise<TrackArtistEntity[]> {
    if (artists.length === 0) {
      return Promise.resolve([])
    }

    return (sql ?? this.databaseService.sql)<TrackArtistEntity[]>`
      INSERT INTO "catalog"."TrackArtist" ${this.databaseService.sql(artists)}
      RETURNING *
    `
  }

  delete(artist: Omit<TrackArtistEntity, 'position'>): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "catalog"."TrackArtist" WHERE "trackId" = ${artist.trackId} AND "artistId" = ${artist.artistId}
    `.then(() => undefined)
  }

  deleteMany(artists: Omit<TrackArtistEntity, 'position'>[]): Promise<void> {
    if (artists.length === 0) {
      return Promise.resolve()
    }

    return this.databaseService.sql`
      DELETE FROM "catalog"."TrackArtist" WHERE "trackId" IN (${this.databaseService.sql(artists.map((artist) => artist.trackId))}) AND "artistId" IN (${this.databaseService.sql(artists.map((artist) => artist.artistId))})
    `.then(() => undefined)
  }
}
