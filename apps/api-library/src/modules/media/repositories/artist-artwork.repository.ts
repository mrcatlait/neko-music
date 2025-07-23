import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { ArtistArtworkEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class ArtistArtworkRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends ArtistArtworkEntity>(artistArtwork: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "media"."ArtistArtwork" (artist_id, background_color, text_color)
      VALUES (${artistArtwork.artistId}, ${artistArtwork.backgroundColor}, ${artistArtwork.textColor})
      RETURNING
        id,
        artist_id AS "artistId",
        background_color AS "backgroundColor",
        text_color AS "textColor",
        processing_status AS "processingStatus",
        processing_attempts AS "processingAttempts",
        processing_error AS "processingError"
    `.then((result) => result.at(0)!)
  }

  update<Type extends ArtistArtworkEntity>(artistArtwork: Type, sql?: Sql): Promise<Type> {
    const mappedArtistArtwork = {
      id: artistArtwork.id,
      artist_id: artistArtwork.artistId,
      background_color: artistArtwork.backgroundColor,
      text_color: artistArtwork.textColor,
      processing_status: artistArtwork.processingStatus,
      processing_attempts: artistArtwork.processingAttempts,
      processing_error: artistArtwork.processingError,
    }

    return (sql ?? this.databaseService.sql)<Type[]>`
      UPDATE "media"."ArtistArtwork"
      SET ${this.databaseService.sql(mappedArtistArtwork)}
      WHERE id = ${artistArtwork.id}
      RETURNING
        id,
        artist_id AS "artistId",
        background_color AS "backgroundColor",
        text_color AS "textColor",
        processing_status AS "processingStatus",
        processing_attempts AS "processingAttempts",
        processing_error AS "processingError"
    `.then((result) => result.at(0)!)
  }
}
