import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { ArtistTable, Database, InjectDatabase } from '@/modules/database'

interface CreateArtistParams {
  readonly artist: Insertable<ArtistTable>
  readonly genres: string[]
}

@Injectable()
export class ArtistRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

  createArtist(params: CreateArtistParams): Promise<Selectable<ArtistTable>> {
    return this.database.transaction().execute(async (trx) => {
      const artist = await trx
        .insertInto('catalog.Artist')
        .values(params.artist)
        .returningAll()
        .executeTakeFirstOrThrow()

      await trx
        .insertInto('catalog.ArtistGenre')
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

  findArtistByName(name: string): Promise<Selectable<ArtistTable> | undefined> {
    return this.database.selectFrom('catalog.Artist').where('name', '=', name).selectAll().executeTakeFirst()
  }
}
