import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { ArtistEntity } from '../entities'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class ArtistRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  find<Type extends ArtistEntity>(id: string, sql?: Sql): Promise<Type | undefined> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      SELECT *
      FROM "catalog"."Artist" 
      WHERE id = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  exists(id: string): Promise<boolean> {
    return this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "catalog"."Artist" WHERE id = ${id})
    `.then((result) => result.at(0)?.exists ?? false)
  }

  existsByName(name: string): Promise<boolean> {
    return this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "catalog"."Artist" WHERE name = ${name})
    `.then((result) => result.at(0)?.exists ?? false)
  }

  existsMany(ids: string[]): Promise<boolean> {
    return this.databaseService.sql<{ exists: boolean }[]>`
      SELECT EXISTS(SELECT 1 FROM "catalog"."Artist" WHERE id IN ${this.databaseService.sql(ids)})
    `.then((result) => result.at(0)?.exists ?? false)
  }
}
