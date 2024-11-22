import { sql } from 'src/db'

export class AlbumRepository {
  exists(albumId: string): Promise<boolean> {
    return sql`
      SELECT 1 FROM "Album" WHERE id = ${albumId}
    `.then((result) => result.length > 0)
  }
}
