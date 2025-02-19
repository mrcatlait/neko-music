import { Injectable } from '@nestjs/common'

import { ArtistImageEntity } from '../entities'

import { DatabaseService } from '@modules/database/services'

@Injectable()
export class ArtistImageRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  create(artistImage: Omit<ArtistImageEntity, 'created_at' | 'updated_at'>): Promise<ArtistImageEntity> {
    return this.databaseService.sql<ArtistImageEntity[]>`
      INSERT INTO "music"."ArtistImage" (artist_id, url, resolution)
      VALUES (${artistImage.artist_id}, ${artistImage.url}, ${artistImage.resolution})
      RETURNING *
    `.then((result) => result.at(0)!)
  }

  createMany(artistImages: Omit<ArtistImageEntity, 'created_at' | 'updated_at'>[]): Promise<ArtistImageEntity[]> {
    if (artistImages.length === 0) {
      return Promise.resolve([])
    }

    return this.databaseService.sql<ArtistImageEntity[]>`
      INSERT INTO "music"."ArtistImage" ${this.databaseService.sql(artistImages)}
      RETURNING *
    `
  }

  update(artistImage: Omit<ArtistImageEntity, 'created_at' | 'updated_at'>): Promise<ArtistImageEntity> {
    return this.databaseService.sql<ArtistImageEntity[]>`
      UPDATE "music"."ArtistImage" SET url = ${artistImage.url}, resolution = ${artistImage.resolution}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${artistImage.id}
      RETURNING *
    `.then((result) => result.at(0)!)
  }
}
