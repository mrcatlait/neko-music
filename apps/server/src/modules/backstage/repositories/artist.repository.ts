import { Injectable } from '@nestjs/common'
import { DeleteResult, Insertable, Selectable, Updateable } from 'kysely'
import { jsonArrayFrom } from 'kysely/helpers/postgres'

import { ArtistStatisticsEntity } from '../entities'
import { BackstageArtistTable, BackstageSchema } from '../backstage.schema'

import { Database, InjectDatabase } from '@/modules/database'
import { CursorPaginatedResult, FindOptions, SearchOptions } from '@/modules/shared/types'

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
export class ArtistRepository {
  constructor(@InjectDatabase() private readonly database: Database<BackstageSchema>) {}

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

  findOne(criteria: string | FindOptions<BackstageArtistTable>): Promise<Selectable<BackstageArtistTable> | undefined> {
    if (typeof criteria === 'string') {
      return this.database.selectFrom('backstage.Artist').selectAll().where('id', '=', criteria).executeTakeFirst()
    }

    return this.database
      .selectFrom('backstage.Artist')
      .selectAll()
      .where((eb) => eb.and(criteria))
      .executeTakeFirst()
  }

  findMany(criteria: string | FindOptions<BackstageArtistTable>): Promise<Selectable<BackstageArtistTable>[]> {
    if (typeof criteria === 'string') {
      return this.database.selectFrom('backstage.Artist').selectAll().where('id', '=', criteria).execute()
    }

    return this.database
      .selectFrom('backstage.Artist')
      .selectAll()
      .where((eb) => eb.and(criteria))
      .execute()
  }

  update(
    criteria: string | FindOptions<BackstageArtistTable>,
    artist: Updateable<BackstageArtistTable>,
  ): Promise<Selectable<BackstageArtistTable>> {
    if (typeof criteria === 'string') {
      return this.database
        .updateTable('backstage.Artist')
        .set(artist)
        .where('id', '=', criteria)
        .returningAll()
        .executeTakeFirstOrThrow()
    }

    return this.database
      .updateTable('backstage.Artist')
      .set(artist)
      .where((eb) => eb.and(criteria))
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  exists(criteria: string | FindOptions<BackstageArtistTable>): Promise<boolean> {
    if (typeof criteria === 'string') {
      return this.database
        .selectFrom('backstage.Artist')
        .select((eb) => eb.lit(true).as('exists'))
        .where('id', '=', criteria)
        .executeTakeFirst()
        .then(Boolean)
    }

    return this.database
      .selectFrom('backstage.Artist')
      .where((eb) => eb.and(criteria))
      .select((eb) => eb.lit(true).as('exists'))
      .executeTakeFirst()
      .then(Boolean)
  }

  count(criteria: string | string[] | FindOptions<BackstageArtistTable>): Promise<number> {
    if (typeof criteria === 'string') {
      return this.database
        .selectFrom('backstage.Artist')
        .where('id', '=', criteria)
        .select((eb) => eb.fn.countAll().as('count'))
        .executeTakeFirst()
        .then((row) => Number(row?.count ?? 0))
    }

    if (Array.isArray(criteria)) {
      return this.database
        .selectFrom('backstage.Artist')
        .where('id', 'in', criteria)
        .select((eb) => eb.fn.countAll().as('count'))
        .executeTakeFirst()
        .then((row) => Number(row?.count ?? 0))
    }

    return this.database
      .selectFrom('backstage.Artist')
      .where((eb) => eb.and(criteria))
      .select((eb) => eb.fn.countAll().as('count'))
      .executeTakeFirst()
      .then((row) => Number(row?.count ?? 0))
  }

  delete(criteria: string | FindOptions<BackstageArtistTable>): Promise<DeleteResult[]> {
    if (typeof criteria === 'string') {
      return this.database.deleteFrom('backstage.Artist').where('id', '=', criteria).execute()
    }

    return this.database
      .deleteFrom('backstage.Artist')
      .where((eb) => eb.and(criteria))
      .execute()
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

  findOneWithGenres(criteria: string): Promise<ArtistWithGenres | undefined> {
    return this.database
      .selectFrom('backstage.Artist')
      .selectAll('backstage.Artist')
      .where('backstage.Artist.id', '=', criteria)
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom('backstage.ArtistGenre')
            .whereRef('backstage.ArtistGenre.artistId', '=', 'backstage.Artist.id')
            .select('genreId')
            .orderBy('position', 'asc'),
        ).as('genres'),
      ])
      .executeTakeFirst()
      .then((row) =>
        row
          ? {
              ...row,
              genres: row.genres.map((g) => g.genreId),
            }
          : undefined,
      )

    // return this.database
    //   .selectFrom('backstage.Artist')
    //   .where('backstage.Artist.id', '=', id)
    //   .selectAll('backstage.Artist')
    //   .select((eb) => [
    //     sql<string[]>`(
    //       select coalesce(
    //         json_agg(ag."genreId" order by ag."position"),
    //         '[]'::json
    //       )
    //       from backstage."ArtistGenre" as ag
    //       where ag."artistId" = ${eb.ref('backstage.Artist.id')}
    //     )`.as('genres'),
    //   ])
    //   .executeTakeFirst()
  }
}
