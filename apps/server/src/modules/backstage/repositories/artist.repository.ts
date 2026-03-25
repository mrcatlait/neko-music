import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, Updateable } from 'kysely'

import { ArtistStatisticsEntity } from '../entities'
import { BackstageArtistTable, BackstageSchema } from '../backstage.schema'

import { Database, InjectDatabase } from '@/modules/database'
import { CursorPaginatedResult, FindOptions, SearchOptions } from '@/modules/shared/types'
import { Repository } from '@/modules/shared/classes'

interface CreateArtistWithGenresParams {
  readonly artist: Insertable<BackstageArtistTable>
  readonly genres: string[]
}

interface UpdateArtistWithGenresParams {
  readonly artist: Updateable<BackstageArtistTable>
  readonly genres: string[]
}

export interface ArtistWithGenres extends Selectable<BackstageArtistTable> {
  readonly genres: string[]
}

@Injectable()
export class ArtistRepository extends Repository<BackstageSchema, 'backstage.Artist'> {
  constructor(@InjectDatabase() database: Database<BackstageSchema>) {
    super(database, 'backstage.Artist')
  }

  createWithGenres(artistWithGenres: CreateArtistWithGenresParams): Promise<Selectable<BackstageArtistTable>> {
    return this.database.transaction().execute(async (trx) => {
      const artist = await trx
        .insertInto('backstage.Artist')
        .values(artistWithGenres.artist)
        .returningAll()
        .executeTakeFirstOrThrow()

      await trx
        .insertInto('backstage.ArtistGenre')
        .values(
          artistWithGenres.genres.map((genre, index) => ({
            artistId: artist.id,
            genreId: genre,
            position: index,
          })),
        )
        .execute()

      return artist
    })
  }

  updateWithGenres(
    criteria: string | FindOptions<BackstageArtistTable>,
    artistWithGenres: UpdateArtistWithGenresParams,
  ): Promise<Selectable<BackstageArtistTable>> {
    return this.database.transaction().execute(async (trx) => {
      let artist: Selectable<BackstageArtistTable>

      if (typeof criteria === 'string') {
        artist = await trx
          .updateTable('backstage.Artist')
          .set(artistWithGenres.artist)
          .where('id', '=', criteria)
          .returningAll()
          .executeTakeFirstOrThrow()
      } else {
        artist = await trx
          .updateTable('backstage.Artist')
          .set(artistWithGenres.artist)
          .where((eb) => eb.and(criteria))
          .returningAll()
          .executeTakeFirstOrThrow()
      }

      await trx.deleteFrom('backstage.ArtistGenre').where('artistId', '=', artist.id).execute()

      await trx
        .insertInto('backstage.ArtistGenre')
        .values(
          artistWithGenres.genres.map((genreId, index) => ({
            artistId: artist.id,
            genreId,
            position: index,
          })),
        )
        .execute()

      return artist
    })
  }

  async search(options: SearchOptions): Promise<CursorPaginatedResult<BackstageArtistTable>> {
    let query = this.database.selectFrom('backstage.Artist').selectAll()

    if (options.cursor) {
      query = query.where('backstage.Artist.id', '>', options.cursor)
    }

    if (options.query) {
      query = query.where('backstage.Artist.name', 'ilike', `%${options.query}%`)
    }

    const rows = await query
      .orderBy('id', 'desc')
      .limit(options.limit + 1)
      .execute()

    const hasNextPage = rows.length > options.limit

    const sliced = hasNextPage ? rows.slice(0, options.limit) : rows

    return {
      data: sliced,
      nextCursor: hasNextPage ? sliced[sliced.length - 1].id : undefined,
    }
  }

  getArtistStatistics(): Promise<ArtistStatisticsEntity[]> {
    return this.database
      .selectFrom('backstage.Artist')
      .select((builder) => [
        builder.ref('backstage.Artist.id').as('id'),
        builder.ref('backstage.Artist.name').as('name'),
        builder.ref('backstage.Artist.status').as('status'),
        builder
          .selectFrom('backstage.AlbumArtist')
          .whereRef('backstage.AlbumArtist.artistId', '=', 'backstage.Artist.id')
          .select((eb) => eb.fn.countAll().as('totalAlbums'))
          .as('totalAlbums'),
        builder
          .selectFrom('backstage.TrackArtist')
          .whereRef('backstage.TrackArtist.artistId', '=', 'backstage.Artist.id')
          .select((eb) => eb.fn.countAll().as('totalTracks'))
          .as('totalTracks'),
      ])
      .execute()
      .then((rows) =>
        rows.map((row) => ({
          id: row.id,
          name: row.name,
          status: row.status,
          totalAlbums: Number(row.totalAlbums ?? 0),
          totalTracks: Number(row.totalTracks ?? 0),
        })),
      )
  }
}
