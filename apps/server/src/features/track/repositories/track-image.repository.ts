import { TrackImageEntity } from '../entities'

import { sql } from 'src/db'

export class TrackImageRepository {
  static create(trackImage: Omit<TrackImageEntity, 'id'>): Promise<unknown> {
    return sql`
      INSERT INTO "TrackImage" (resolution, url, track_id)
      VALUES (${trackImage.resolution}, ${trackImage.url}, ${trackImage.track_id})
    `
  }
}
