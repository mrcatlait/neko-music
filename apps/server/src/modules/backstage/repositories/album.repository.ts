import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { PublishingStatus } from '../enums'

import { BackstageAlbumTable, Database, InjectDatabase } from '@/modules/database'

@Injectable()
export class AlbumRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

  findAlbumById(id: string): Promise<Selectable<BackstageAlbumTable> | undefined> {
    return this.database.selectFrom('backstage.Album').where('id', '=', id).selectAll().executeTakeFirst()
  }

  async findAlbumWithGenresAndArtistsById(
    id: string,
  ): Promise<
    | (Selectable<BackstageAlbumTable> & { genres: string[]; artists: { artistId: string; role: string }[] })
    | undefined
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

  publishAlbum(albumId: string, catalogAlbumId: string, userId: string): Promise<void> {
    return this.database
      .updateTable('backstage.Album')
      .set({
        catalogAlbumId,
        status: PublishingStatus.PUBLISHED,
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .where('id', '=', albumId)
      .execute()
      .then(() => undefined)
  }
}
