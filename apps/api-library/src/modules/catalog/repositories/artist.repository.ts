import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { ArtistEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class ArtistRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends ArtistEntity>(artist: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "catalog"."Artist" (name, verified, status)
      VALUES (${artist.name}, ${artist.verified}, ${artist.status})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  update(artist: ArtistEntity, sql?: Sql): Promise<ArtistEntity> {
    return (sql ?? this.databaseService.sql)<ArtistEntity[]>`
      UPDATE "catalog"."Artist" 
      SET ${this.databaseService.sql(artist)}
      WHERE id = ${artist.id}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  delete(id: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "catalog"."Artist" WHERE id = ${id}
    `.then(() => undefined)
  }

  findOne<Type extends ArtistEntity>(id: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      SELECT *
      FROM "catalog"."Artist" 
      WHERE id = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  exists(name: string): Promise<boolean> {
    return this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "catalog"."Artist" WHERE name = ${name})
    `.then((result) => result.at(0)?.exists ?? false)
  }

  existsAll(ids: string[]): Promise<boolean> {
    return this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "catalog"."Artist" WHERE id IN ${this.databaseService.sql(ids)})
    `.then((result) => result.at(0)?.exists ?? false)
  }
}
