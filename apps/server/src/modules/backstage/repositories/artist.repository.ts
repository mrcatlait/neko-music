import { Injectable } from '@nestjs/common'
import { Insertable, Selectable } from 'kysely'

import { PublishingStatus } from '../enums'

import { BackstageArtistTable, Database, InjectDatabase } from '@/modules/database'

interface CreateArtistParams {
  readonly artist: Insertable<BackstageArtistTable>
  readonly genres: string[]
}

@Injectable()
export class ArtistRepository {
  constructor(@InjectDatabase() private readonly database: Database) {}

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

  publishArtist(artistId: string, catalogArtistId: string, userId: string): Promise<void> {
    return this.database
      .updateTable('backstage.Artist')
      .set({
        catalogArtistId,
        status: PublishingStatus.PUBLISHED,
        updatedAt: new Date(),
        updatedBy: userId,
      })
      .where('id', '=', artistId)
      .execute()
      .then(() => undefined)
  }

  findArtistByName(name: string): Promise<Selectable<BackstageArtistTable> | undefined> {
    return this.database.selectFrom('backstage.Artist').where('name', '=', name).selectAll().executeTakeFirst()
  }

  findArtistById(id: string): Promise<Selectable<BackstageArtistTable> | undefined> {
    return this.database.selectFrom('backstage.Artist').where('id', '=', id).selectAll().executeTakeFirst()
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
