import { Injectable } from '@nestjs/common'
import { DatabaseService } from '@modules/database'

import { AlbumEntity } from '../entities'

@Injectable()
export class AlbumRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  findOne(id: string): Promise<AlbumEntity | undefined> {
    return this.databaseService.sql<AlbumEntity[]>`
      SELECT * FROM "music"."Album" WHERE id = ${id}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  findOneByTitle(title: string): Promise<AlbumEntity | undefined> {
    return this.databaseService.sql<AlbumEntity[]>`
      SELECT * FROM "music"."Album" WHERE title = ${title}
      LIMIT 1
    `.then((result) => result.at(0))
  }
}
