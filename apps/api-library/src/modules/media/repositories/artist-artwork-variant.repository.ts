import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { ArtistArtworkVariantEntity } from '../entities'

import { DatabaseService } from '@modules/database'

@Injectable()
export class ArtistArtworkVariantRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends ArtistArtworkVariantEntity>(artistArtworkVariant: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "media"."ArtistArtworkVariant" (artist_artwork_id, format, storage_provider, storage_path, public_url, size, file_size, file_hash)
      VALUES (${artistArtworkVariant.artistArtworkId}, ${artistArtworkVariant.format}, ${artistArtworkVariant.storageProvider}, ${artistArtworkVariant.storagePath}, ${artistArtworkVariant.publicUrl}, ${artistArtworkVariant.size}, ${artistArtworkVariant.fileSize}, ${artistArtworkVariant.fileHash})
      RETURNING
        id,
        artist_artwork_id AS "artistArtworkId",
        format,
        storage_provider AS "storageProvider",
        storage_path AS "storagePath",
        public_url AS "publicUrl",
        size,
        file_size AS "fileSize",
        file_hash AS "fileHash"
    `.then((result) => result.at(0)!)
  }

  findByHash<Type extends ArtistArtworkVariantEntity>(hash: string): Promise<Type | undefined> {
    return this.databaseService.sql<Type[]>`
      ${this.selectFragment}
      WHERE "file_hash" = ${hash}
    `.then((result) => result.at(0))
  }

  private readonly selectFragment = this.databaseService.sql`
    SELECT
      id,
      artist_artwork_id AS "artistArtworkId",
      format,
      storage_provider AS "storageProvider",
      storage_path AS "storagePath",
      public_url AS "publicUrl",
      size,
      file_size AS "fileSize",
      file_hash AS "fileHash"
    FROM "media"."ArtistArtworkVariant"
  `
}
