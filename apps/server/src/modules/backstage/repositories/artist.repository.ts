import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { PublishingStatus } from '../enums'
import { ArtistStatisticsEntity } from '../entities'
import { BackstageArtistTable, BackstageSchema } from '../backstage.schema'

import { Database, InjectDatabase } from '@/modules/database'

interface CreateArtistParams {
  readonly artist: Insertable<BackstageArtistTable>
  readonly genres: string[]
}

@Injectable()
export class ArtistRepository {
  constructor(@InjectDatabase() private readonly database: Database<BackstageSchema>) {}

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

  publishArtist(artistId: string, catalogArtistId: string): Promise<void> {
    return this.database
      .updateTable('backstage.Artist')
      .set({
        catalogArtistId,
        status: PublishingStatus.PUBLISHED,
      })
      .where('id', '=', artistId)
      .execute()
      .then(() => undefined)
  }

  updateArtistStatus(artistId: string, status: PublishingStatus): Promise<void> {
    return this.database
      .updateTable('backstage.Artist')
      .set({ status })
      .where('id', '=', artistId)
      .execute()
      .then(() => undefined)
  }

  updateArtist(params: { artistId: string; name: string; genres: string[] }): Promise<void> {
    return this.database
      .transaction()
      .execute(async (trx) => {
        await trx.updateTable('backstage.Artist').set({ name: params.name }).where('id', '=', params.artistId).execute()

        await trx.deleteFrom('backstage.ArtistGenre').where('artistId', '=', params.artistId).execute()

        await trx
          .insertInto('backstage.ArtistGenre')
          .values(
            params.genres.map((genreId, index) => ({
              artistId: params.artistId,
              genreId,
              position: index,
            })),
          )
          .execute()
      })
      .then(() => undefined)
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
