import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { AlbumEntity, WithArtists } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class AlbumRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends AlbumEntity>(album: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "catalog"."Album" ("name", "releaseDate", "explicit", "type")
      VALUES (${album.name}, ${album.releaseDate}, ${album.explicit}, ${album.type})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  findOne<Type extends WithArtists<AlbumEntity>>(id: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "catalog"."Album"
      WHERE id = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  exists(id: string): Promise<boolean> {
    return this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS (SELECT 1 FROM "catalog"."Album" WHERE id = ${id})
    `.then((result) => result.at(0)?.exists ?? false)
  }

  existsByName(name: string): Promise<boolean> {
    return this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS (SELECT 1 FROM "catalog"."Album" WHERE name = ${name})
    `.then((result) => result.at(0)?.exists ?? false)
  }

  findPopular<Type extends WithArtists<AlbumEntity>>(): Promise<Type[]> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "catalog"."Album"
      LIMIT 12
    `
  }
}
