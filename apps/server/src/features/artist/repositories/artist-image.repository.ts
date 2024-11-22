import { ArtistImageEntity } from '../entities'

import { sql } from 'src/db'

export class ArtistImageRepository {
  static create(artistImage: Omit<ArtistImageEntity, 'id'>): Promise<unknown> {
    return sql`
      INSERT INTO "ArtistImage" (resolution, url, artist_id)
      VALUES (${artistImage.resolution}, ${artistImage.url}, ${artistImage.artist_id})
    `
  }
}
