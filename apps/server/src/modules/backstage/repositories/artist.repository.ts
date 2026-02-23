import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { PublishingStatus } from '../enums'
import { SYSTEM_USER } from '../constants'

import { BackstageArtistTable, Database, InjectDatabase } from '@/modules/database'

interface CreateArtistParams {
  readonly artist: Insertable<BackstageArtistTable>
  readonly genres: string[]
}

@Injectable()
export class ArtistRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

  createArtist(params: CreateArtistParams): Promise<Selectable<BackstageArtistTable>> {
    return this.database.transaction().execute(async (trx) => {
      const artist = await trx
        .insertInto('backstage.Artist')
        .values(params.artist)
        .returningAll()
        .executeTakeFirstOrThrow()

      await trx
        .insertInto('backstage.ArtistGenre')
        .values(
          params.genres.map((genre, index) => ({
            artistId: artist.id,
            genreId: genre,
            position: index,
          })),
        )
        .execute()

      return artist
    })
  }

  publishArtist(artistId: string): Promise<void> {
    return this.database
      .updateTable('backstage.Artist')
      .set({ status: PublishingStatus.PUBLISHED, updatedAt: new Date(), updatedBy: SYSTEM_USER })
      .where('id', '=', artistId)
      .execute()
      .then(() => undefined)
  }

  findArtistByName(name: string): Promise<Selectable<BackstageArtistTable> | undefined> {
    return this.database.selectFrom('backstage.Artist').where('name', '=', name).selectAll().executeTakeFirst()
  }

  findArtistById(id: string): Promise<Selectable<BackstageArtistTable> | undefined> {
    return this.database.selectFrom('backstage.Artist').where('id', '=', id).selectAll().executeTakeFirst()
  }
}
