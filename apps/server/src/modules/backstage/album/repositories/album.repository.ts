import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, Updateable } from 'kysely'

import { BackstageAlbumTable, BackstageSchema } from '../../backstage.schema'

import { Database, InjectDatabase } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

interface CreateWithGenresParams extends Insertable<BackstageAlbumTable> {
  genres: string[]
}

interface UpdateWithGenresParams extends Updateable<BackstageAlbumTable> {
  genres: string[]
}

@Injectable()
export class AlbumRepository extends Repository<BackstageSchema, 'backstage.Album'> {
  constructor(@InjectDatabase() database: Database<BackstageSchema>) {
    super(database, 'backstage.Album')
  }

  createWithGenres(params: CreateWithGenresParams): Promise<Selectable<BackstageAlbumTable>> {
    return this.database.transaction().execute(async (tx) => {
      const album = await tx
        .insertInto('backstage.Album')
        .values({
          name: params.name,
          status: params.status,
          releaseDate: params.releaseDate,
          explicit: params.explicit,
          type: params.type,
          createdBy: params.createdBy,
          updatedBy: params.updatedBy,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      await tx
        .insertInto('backstage.AlbumGenre')
        .values(params.genres.map((genre, index) => ({ albumId: album.id, genreId: genre, position: index })))
        .execute()
      return album
    })
  }

  updateWithGenres(id: string, params: UpdateWithGenresParams): Promise<Selectable<BackstageAlbumTable>> {
    return this.database.transaction().execute(async (tx) => {
      const album = await tx
        .updateTable('backstage.Album')
        .set({
          name: params.name,
          releaseDate: params.releaseDate,
          explicit: params.explicit,
          type: params.type,
          artwork: params.artwork,
          status: params.status,
          updatedBy: params.updatedBy,
          updatedAt: new Date(),
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      await tx.deleteFrom('backstage.AlbumGenre').where('albumId', '=', id).execute()

      await tx
        .insertInto('backstage.AlbumGenre')
        .values(params.genres.map((genre, index) => ({ albumId: id, genreId: genre, position: index })))
        .execute()

      return album
    })
  }
}
