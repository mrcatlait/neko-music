import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { TrackEntity } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class TrackRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends TrackEntity>(track: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "catalog"."Track" ("name", "albumId", "trackNumber", "diskNumber", "releaseDate", "duration", "hasLyrics", "explicit")
      VALUES (${track.name}, ${track.albumId}, ${track.trackNumber}, ${track.diskNumber}, ${track.releaseDate}, ${track.duration}, ${track.hasLyrics}, ${track.explicit})
      RETURNING *
    `.then((result) => result.at(0)!)
  }
}
