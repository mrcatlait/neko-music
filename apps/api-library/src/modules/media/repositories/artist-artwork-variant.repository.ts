import { Injectable } from '@nestjs/common'
import { Sql } from 'postgres'

import { ArtistArtworkVariantEntity } from '../entities'
import { ArtworkSize } from '../enums'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class ArtistArtworkVariantRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create<Type extends ArtistArtworkVariantEntity>(artistArtworkVariant: Omit<Type, 'id'>, sql?: Sql): Promise<Type> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      INSERT INTO "media"."ArtistArtworkVariant" (artist_artwork_id, format, storage_provider, storage_path, public_url, size, file_size)
      VALUES (${artistArtworkVariant.artistArtworkId}, ${artistArtworkVariant.format}, ${artistArtworkVariant.storageProvider}, ${artistArtworkVariant.storagePath}, ${artistArtworkVariant.publicUrl}, ${artistArtworkVariant.size}, ${artistArtworkVariant.fileSize})
      RETURNING
        id,
        artist_artwork_id AS "artistArtworkId",
        format,
        storage_provider AS "storageProvider",
        storage_path AS "storagePath",
        public_url AS "publicUrl",
        size,
        file_size AS "fileSize"
    `.then((result) => result.at(0)!)
  }

  findByArtworkIdAndSize<Type extends ArtistArtworkVariantEntity>(
    id: string,
    size: ArtworkSize,
    sql?: Sql,
  ): Promise<Type | undefined> {
    return (sql ?? this.databaseService.sql)<Type[]>`
      ${this.selectFragment}
      WHERE artist_artwork_id = ${id} AND size = ${size}
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
      file_size AS "fileSize"
    FROM "media"."ArtistArtworkVariant"
  `
}
