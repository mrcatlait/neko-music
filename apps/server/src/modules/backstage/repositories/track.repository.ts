import { Injectable } from '@nestjs/common'

import { Database, InjectDatabase } from '@/modules/database'

@Injectable()
export class TrackRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

  countTracksByAlbumId(albumId: string): Promise<number> {
    return this.database
      .selectFrom('backstage.Track')
      .where('albumId', '=', albumId)
      .select((eb) => eb.fn.countAll().as('count'))
      .executeTakeFirst()
      .then((row) => Number(row?.count ?? 0))
  }
}
