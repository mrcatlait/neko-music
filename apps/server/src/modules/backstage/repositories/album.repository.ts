import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { PublishingStatus } from '../enums'
import { BackstageAlbumTable, BackstageSchema } from '../backstage.schema'

import { Database, InjectDatabase } from '@/modules/database'

interface CreateAlbumWithGenresAndArtistsParams {
  readonly album: Insertable<BackstageAlbumTable>
  readonly genres: string[]
  readonly artists: { id: string; role: string }[]
}

@Injectable()
export class AlbumRepository {
  constructor(@InjectDatabase() private readonly database: Database<BackstageSchema>) {}

  createAlbumWithGenresAndArtists(
    params: CreateAlbumWithGenresAndArtistsParams,
  ): Promise<Selectable<BackstageAlbumTable>> {
    return this.database.transaction().execute(async (trx) => {
      const album = await trx
        .insertInto('backstage.Album')
        .values(params.album)
        .returningAll()
        .executeTakeFirstOrThrow()

      await trx
        .insertInto('backstage.AlbumGenre')
        .values(
          params.genres.map((genre, index) => ({
            albumId: album.id,
            genreId: genre,
            position: index,
          })),
        )
        .execute()

      await trx
        .insertInto('backstage.AlbumArtist')
        .values(
          params.artists.map((artist, index) => ({
            albumId: album.id,
            artistId: artist.artistId,
            role: artist.role,
            position: index,
          })),
        )
        .execute()

      return album
    })
  }

  findAlbumById(id: string): Promise<Selectable<BackstageAlbumTable> | undefined> {
    return this.database.selectFrom('backstage.Album').where('id', '=', id).selectAll().executeTakeFirst()
  }

  findAlbumByName(name: string): Promise<Selectable<BackstageAlbumTable> | undefined> {
    return this.database.selectFrom('backstage.Album').where('name', '=', name).selectAll().executeTakeFirst()
  }

  async findAlbumWithGenresAndArtistsById(
    id: string,
  ): Promise<
    (Selectable<BackstageAlbumTable> & { genres: string[]; artists: { artistId: string; role: string }[] }) | undefined
  > {
    const album = await this.findAlbumById(id)
    if (!album) return undefined

    const [albumGenres, albumArtists] = await Promise.all([
      this.database
        .selectFrom('backstage.AlbumGenre')
        .where('albumId', '=', id)
        .orderBy('position', 'asc')
        .select('genreId')
        .execute(),
      this.database
        .selectFrom('backstage.AlbumArtist')
        .where('albumId', '=', id)
        .select(['artistId', 'role'])
        .execute(),
    ])

    return {
      ...album,
      genres: albumGenres.map((ag) => ag.genreId),
      artists: albumArtists.map((a) => ({ artistId: a.artistId, role: a.role })),
    }
  }

  publishAlbum(albumId: string, catalogAlbumId: string): Promise<void> {
    return this.database
      .updateTable('backstage.Album')
      .set({
        catalogAlbumId,
        status: PublishingStatus.Published,
      })
      .where('id', '=', albumId)
      .execute()
      .then(() => undefined)
  }
}
