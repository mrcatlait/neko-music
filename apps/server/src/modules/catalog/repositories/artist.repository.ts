import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { CatalogArtistTable, CatalogSchema } from '../catalog.schema'

import { Database, InjectDatabase } from '@/modules/database'

interface CreateArtistParams {
  readonly artist: Insertable<CatalogArtistTable>
  readonly genres: string[]
}

interface UpdateArtistParams {
  readonly artist: Selectable<CatalogArtistTable>
  readonly genres: string[]
}

@Injectable()
export class ArtistRepository {
  constructor(@InjectDatabase() private readonly database: Database<CatalogSchema>) {}

  createArtist(params: CreateArtistParams): Promise<Selectable<CatalogArtistTable>> {
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

  updateArtist(params: UpdateArtistParams): Promise<void> {
    return this.database
      .transaction()
      .execute(async (trx) => {
        const artistId = params.artist.id

        await trx.updateTable('catalog.Artist').set(params.artist).where('id', '=', artistId).execute()
        await trx.deleteFrom('catalog.ArtistGenre').where('artistId', '=', artistId).execute()

        await trx
          .insertInto('catalog.ArtistGenre')
          .values(
            params.genres.map((genreId, index) => ({
              artistId,
              genreId,
              position: index,
            })),
          )
          .execute()
      })
      .then(() => undefined)
  }

  findArtistByName(name: string): Promise<Selectable<CatalogArtistTable> | undefined> {
    return this.database.selectFrom('catalog.Artist').where('name', '=', name).selectAll().executeTakeFirst()
  }

  findArtistByNameExcluding(name: string, excludeId: string): Promise<Selectable<CatalogArtistTable> | undefined> {
    return this.database
      .selectFrom('catalog.Artist')
      .where('name', '=', name)
      .where('id', '!=', excludeId)
      .selectAll()
      .executeTakeFirst()
  }

  findArtistById(id: string): Promise<Selectable<CatalogArtistTable> | undefined> {
    return this.database.selectFrom('catalog.Artist').where('id', '=', id).selectAll().executeTakeFirst()
  }
}
