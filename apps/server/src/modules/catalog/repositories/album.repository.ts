import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { CatalogAlbumTable, Database, InjectDatabase } from '@/modules/database'

interface CreateAlbumParams {
  readonly album: Insertable<CatalogAlbumTable>
  readonly genres: string[]
  readonly artists: { artistId: string; role: string }[]
}

@Injectable()
export class AlbumRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

  createAlbum(params: CreateAlbumParams): Promise<Selectable<CatalogAlbumTable>> {
    return this.database.transaction().execute(async (trx) => {
      const album = await trx.insertInto('catalog.Album').values(params.album).returningAll().executeTakeFirstOrThrow()

      await trx
        .insertInto('catalog.AlbumGenre')
        .values(
          params.genres.map((genreId, index) => ({
            albumId: album.id,
            genreId,
            position: index,
          })),
        )
        .execute()

      await trx
        .insertInto('catalog.AlbumArtist')
        .values(
          params.artists.map((a) => ({
            albumId: album.id,
            artistId: a.artistId,
            role: a.role,
          })),
        )
        .execute()

      return album
    })
  }
}
