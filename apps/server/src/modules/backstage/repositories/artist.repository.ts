import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, Updateable } from 'kysely'

import { ArtistStatisticsEntity } from '../entities'
import { BackstageArtistTable, BackstageSchema } from '../backstage.schema'

import { Database, InjectDatabase } from '@/modules/database'

interface CreateArtistWithGenresParams {
  readonly artist: Insertable<BackstageArtistTable>
  readonly genres: string[]
}

interface UpdateArtistWithGenresParams {
  readonly artist: Omit<Selectable<BackstageArtistTable>, 'status' | 'catalogArtistId'>
  readonly genres: string[]
}

interface UpdateArtistParams extends Updateable<BackstageArtistTable> {
  readonly id: string
}

@Injectable()
export class ArtistRepository {
  constructor(@InjectDatabase() private readonly database: Database<BackstageSchema>) {}

  createArtistWithGenres(params: CreateArtistWithGenresParams): Promise<Selectable<BackstageArtistTable>> {
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

  update(params: UpdateArtistParams): Promise<Selectable<BackstageArtistTable>> {
    return this.database
      .updateTable('backstage.Artist')
      .set(params)
      .where('id', '=', params.id)
      .returningAll()
      .executeTakeFirstOrThrow()
  }

  updateArtistWithGenres(params: UpdateArtistWithGenresParams): Promise<Selectable<BackstageArtistTable>> {
    return this.database.transaction().execute(async (trx) => {
      const artist = await trx
        .updateTable('backstage.Artist')
        .set(params.artist)
        .where('id', '=', params.artist.id)
        .returningAll()
        .executeTakeFirstOrThrow()

      await trx.deleteFrom('backstage.ArtistGenre').where('artistId', '=', params.artist.id).execute()

      await trx
        .insertInto('backstage.ArtistGenre')
        .values(
          params.genres.map((genreId, index) => ({
            artistId: params.artist.id,
            genreId,
            position: index,
          })),
        )
        .execute()

      return artist
    })
  }

  findArtistByNameExcluding(name: string, excludeId: string): Promise<Selectable<BackstageArtistTable> | undefined> {
    return this.database
      .selectFrom('backstage.Artist')
      .where('name', '=', name)
      .where('id', '!=', excludeId)
      .selectAll()
      .executeTakeFirst()
  }

  findArtistByName(name: string): Promise<Selectable<BackstageArtistTable> | undefined> {
    return this.database.selectFrom('backstage.Artist').where('name', '=', name).selectAll().executeTakeFirst()
  }

  findArtistById(id: string): Promise<Selectable<BackstageArtistTable> | undefined> {
    return this.database.selectFrom('backstage.Artist').where('id', '=', id).selectAll().executeTakeFirst()
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

  async findArtistWithGenresById(
    id: string,
  ): Promise<(Selectable<BackstageArtistTable> & { genres: string[] }) | undefined> {
    const artist = await this.findArtistById(id)
    if (!artist) return undefined

    const artistGenres = await this.database
      .selectFrom('backstage.ArtistGenre')
      .where('artistId', '=', id)
      .orderBy('position', 'asc')
      .select('genreId')
      .execute()

    return {
      ...artist,
      genres: artistGenres.map((ag) => ag.genreId),
    }
  }
}
