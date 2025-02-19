import { Injectable } from '@nestjs/common'

import { ArtistNoteEntity } from '../entities'

import { DatabaseService } from '@modules/database/services'

@Injectable()
export class ArtistNoteRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  getByArtistId(artistId: string): Promise<ArtistNoteEntity | undefined> {
    return this.databaseService.sql<ArtistNoteEntity[]>`
      SELECT * FROM "music"."ArtistNote"
      WHERE "artist_id" = ${artistId}
      LIMIT 1
    `.then((result) => result.at(0))
  }

  create(artistNote: Omit<ArtistNoteEntity, 'created_at' | 'updated_at'>): Promise<ArtistNoteEntity> {
    return this.databaseService.sql<ArtistNoteEntity[]>`
      INSERT INTO "music"."ArtistNote" (artist_id, short_text, standard_text)
      VALUES (${artistNote.artistId}, ${artistNote.shortText}, ${artistNote.standardText})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  update(artistNote: Omit<ArtistNoteEntity, 'created_at' | 'updated_at'>): Promise<ArtistNoteEntity> {
    return this.databaseService.sql<ArtistNoteEntity[]>`
      UPDATE "music"."ArtistNote" SET short_text = ${artistNote.shortText}, standard_text = ${artistNote.standardText}, updated_at = CURRENT_TIMESTAMP
      WHERE artist_id = ${artistNote.artistId}
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  delete(artistId: string): Promise<void> {
    return this.databaseService.sql`
      DELETE FROM "music"."ArtistNote" WHERE artist_id = ${artistId}
    `.then(() => undefined)
  }
}
