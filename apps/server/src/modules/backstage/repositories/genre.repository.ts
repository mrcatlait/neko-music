import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, Updateable } from 'kysely'

import { GenreStatisticsEntity } from '../entities'

import { InjectDatabase, Database } from '@/modules/database'
import { CatalogSchema, GenreTable } from '@/modules/catalog/catalog.schema'

@Injectable()
export class GenreRepository {
  constructor(@InjectDatabase() private readonly database: Database<CatalogSchema>) {}

  findGenresByIds(ids: string[]): Promise<Selectable<GenreTable>[]> {
    return this.database.selectFrom('catalog.Genre').where('id', 'in', ids).selectAll().execute()
  }

  findGenreById(id: string): Promise<Selectable<GenreTable> | undefined> {
    return this.database.selectFrom('catalog.Genre').where('id', '=', id).selectAll().executeTakeFirst()
  }

  findGenreByName(name: string): Promise<Selectable<GenreTable> | undefined> {
    return this.database.selectFrom('catalog.Genre').where('name', '=', name).selectAll().executeTakeFirst()
  }

  createGenre(genre: Insertable<GenreTable>): Promise<Selectable<GenreTable>> {
    return this.database.insertInto('catalog.Genre').values(genre).returningAll().executeTakeFirstOrThrow()
  }

  updateGenre(genre: Updateable<GenreTable>): Promise<Selectable<GenreTable>> {
    return this.database
      .updateTable('catalog.Genre')
      .set({
        name: genre.name,
      })
      .where('id', '=', genre.id)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  findAllGenres(): Promise<Selectable<GenreTable>[]> {
    return this.database.selectFrom('catalog.Genre').selectAll().execute()
  }

  getGenreStatistics(): Promise<GenreStatisticsEntity[]> {
    return this.database
      .selectFrom('catalog.Genre')
      .select((builder) => [
        builder.ref('catalog.Genre.id').as('id'),
        builder.ref('catalog.Genre.name').as('name'),
        builder
          .selectFrom('catalog.ArtistGenre')
          .whereRef('catalog.ArtistGenre.genreId', '=', 'catalog.Genre.id')
          .select((eb) => eb.fn.countAll().as('totalArtists'))
          .as('totalArtists'),
        builder
          .selectFrom('catalog.AlbumGenre')
          .whereRef('catalog.AlbumGenre.genreId', '=', 'catalog.Genre.id')
          .select((eb) => eb.fn.countAll().as('totalAlbums'))
          .as('totalAlbums'),
        builder
          .selectFrom('catalog.TrackGenre')
          .whereRef('catalog.TrackGenre.genreId', '=', 'catalog.Genre.id')
          .select((eb) => eb.fn.countAll().as('totalTracks'))
          .as('totalTracks'),
      ])
      .execute()
      .then((rows) =>
        rows.map((row) => ({
          id: row.id,
          name: row.name,
          totalArtists: Number(row.totalArtists ?? 0),
          totalAlbums: Number(row.totalAlbums ?? 0),
          totalTracks: Number(row.totalTracks ?? 0),
        })),
      )
  }
}
