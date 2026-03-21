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

  updateArtist(params: UpdateArtistParams): Promise<Selectable<CatalogArtistTable>> {
    return this.database.transaction().execute(async (trx) => {
      const artistId = params.artist.id

      const artist = await trx
        .updateTable('catalog.Artist')
        .set(params.artist)
        .where('id', '=', artistId)
        .returningAll()
        .executeTakeFirstOrThrow()

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

      return artist
    })
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

  async findAllArtistsWithGenres(): Promise<Array<Selectable<CatalogArtistTable> & { genres: string[] }>> {
    const artists = await this.database.selectFrom('catalog.Artist').selectAll().orderBy('name', 'asc').execute()

    if (artists.length === 0) {
      return []
    }

    const artistIds = artists.map((a) => a.id)

    const genreRows = await this.database
      .selectFrom('catalog.ArtistGenre')
      .where('artistId', 'in', artistIds)
      .orderBy('artistId', 'asc')
      .orderBy('position', 'asc')
      .select(['artistId', 'genreId'])
      .execute()

    const genresByArtist = new Map<string, string[]>()
    for (const row of genreRows) {
      const list = genresByArtist.get(row.artistId) ?? []
      list.push(row.genreId)
      genresByArtist.set(row.artistId, list)
    }

    return artists.map((artist) => ({
      ...artist,
      genres: genresByArtist.get(artist.id) ?? [],
    }))
  }
}
