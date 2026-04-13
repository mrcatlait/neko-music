import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, Updateable } from 'kysely'

import { BackstageTrackTable, BackstageSchema } from '../../backstage.schema'

import { Database, InjectDatabase } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

interface CreateWithGenresParams extends Insertable<BackstageTrackTable> {
  genres: string[]
}

interface UpdateWithGenresParams extends Updateable<BackstageTrackTable> {
  genres: string[]
}

@Injectable()
export class TrackRepository extends Repository<BackstageSchema, 'backstage.Track'> {
  constructor(@InjectDatabase() database: Database<BackstageSchema>) {
    super(database, 'backstage.Track')
  }

  createWithGenres(params: CreateWithGenresParams): Promise<Selectable<BackstageTrackTable>> {
    return this.database.transaction().execute(async (tx) => {
      const track = await tx
        .insertInto('backstage.Track')
        .values({
          name: params.name,
          status: params.status,
          albumId: params.albumId,
          trackNumber: params.trackNumber,
          diskNumber: params.diskNumber,
          releaseDate: params.releaseDate,
          type: params.type,
          explicit: params.explicit,
          createdBy: params.createdBy,
          updatedBy: params.updatedBy,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      await tx
        .insertInto('backstage.TrackGenre')
        .values(params.genres.map((genre, index) => ({ trackId: track.id, genreId: genre, position: index })))
        .execute()

      return track
    })
  }

  updateWithGenres(id: string, params: UpdateWithGenresParams): Promise<Selectable<BackstageTrackTable>> {
    return this.database.transaction().execute(async (tx) => {
      const track = await tx
        .updateTable('backstage.Track')
        .set({
          name: params.name,
          albumId: params.albumId,
          trackNumber: params.trackNumber,
          diskNumber: params.diskNumber,
          releaseDate: params.releaseDate,
          explicit: params.explicit,
          type: params.type,
          artwork: params.artwork,
          playback: params.playback,
          status: params.status,
          updatedBy: params.updatedBy,
          updatedAt: new Date(),
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      await tx.deleteFrom('backstage.TrackGenre').where('trackId', '=', id).execute()

      await tx
        .insertInto('backstage.TrackGenre')
        .values(params.genres.map((genre, index) => ({ trackId: id, genreId: genre, position: index })))
        .execute()

      return track
    })
  }
}
