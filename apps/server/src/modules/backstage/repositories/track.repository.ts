import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { BackstageSchema, BackstageTrackTable } from '../backstage.schema'

import { Database, InjectDatabase } from '@/modules/database'
import { ArtistRole } from '@/modules/shared/dtos'

interface CreateTrackWithGenresAndArtistsParams {
  readonly track: Insertable<BackstageTrackTable>
  readonly genres: string[]
  readonly artists: ArtistRole[]
}

@Injectable()
export class TrackRepository {
  constructor(@InjectDatabase() private readonly database: Database<BackstageSchema>) {}

  countTracksByAlbumId(albumId: string): Promise<number> {
    return this.database
      .selectFrom('backstage.Track')
      .where('albumId', '=', albumId)
      .select((eb) => eb.fn.countAll().as('count'))
      .executeTakeFirst()
      .then((row) => Number(row?.count ?? 0))
  }

  createTrackWithGenresAndArtists(
    params: CreateTrackWithGenresAndArtistsParams,
  ): Promise<Selectable<BackstageTrackTable>> {
    return this.database.transaction().execute(async (trx) => {
      const track = await trx
        .insertInto('backstage.Track')
        .values(params.track)
        .returningAll()
        .executeTakeFirstOrThrow()

      await trx
        .insertInto('backstage.TrackGenre')
        .values(
          params.genres.map((genre, index) => ({
            trackId: track.id,
            genreId: genre,
            position: index,
          })),
        )
        .execute()

      await trx
        .insertInto('backstage.TrackArtist')
        .values(
          params.artists.map((artist) => ({
            trackId: track.id,
            artistId: artist.id,
            role: artist.role,
          })),
        )
        .execute()

      return track
    })
  }
}
