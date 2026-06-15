import { Injectable } from '@nestjs/common'
import { Insertable, Selectable, Updateable, sql } from 'kysely'

import { BackstageArtistTable, BackstageGenreTable, BackstageSchema } from '../../backstage.schema'

import { Database, InjectDatabase } from '@/modules/database'
import { Repository } from '@/modules/shared/classes'

interface CreateWithGenresParams extends Insertable<BackstageArtistTable> {
  genres: string[]
}

interface UpdateWithGenresParams extends Updateable<BackstageArtistTable> {
  genres: string[]
}

interface FuzzyMatchResult {
  id: string
  name: string
  distance: number
}

type ArtistGenre = Selectable<BackstageGenreTable> & { artistId: string }

@Injectable()
export class ArtistRepository extends Repository<BackstageSchema, 'backstage.Artist'> {
  constructor(@InjectDatabase() database: Database<BackstageSchema>) {
    super(database, 'backstage.Artist')
  }

  findByFuzzyName(name: string, maxDistance = 3): Promise<FuzzyMatchResult[]> {
    return this.database
      .selectFrom('backstage.Artist')
      .select(['id', 'name'])
      .select((eb) => sql<number>`levenshtein(${eb.ref('name')}::text, ${name}::text)`.as('distance'))
      .where((eb) => sql`levenshtein(${eb.ref('name')}::text, ${name}::text)`, '<=', maxDistance)
      .orderBy((eb) => sql`levenshtein(${eb.ref('name')}::text, ${name}::text)`)
      .limit(5)
      .execute() as Promise<FuzzyMatchResult[]>
  }

  createWithGenres(params: CreateWithGenresParams): Promise<Selectable<BackstageArtistTable>> {
    return this.database.transaction().execute(async (tx) => {
      const artist = await tx
        .insertInto('backstage.Artist')
        .values({
          name: params.name,
          status: params.status,
          verified: params.verified,
          createdBy: params.createdBy,
          updatedBy: params.updatedBy,
        })
        .returningAll()
        .executeTakeFirstOrThrow()

      await tx
        .insertInto('backstage.ArtistGenre')
        .values(params.genres.map((genre, index) => ({ artistId: artist.id, genreId: genre, position: index })))
        .execute()
      return artist
    })
  }

  updateWithGenres(id: string, params: UpdateWithGenresParams): Promise<Selectable<BackstageArtistTable>> {
    return this.database.transaction().execute(async (tx) => {
      const artist = await tx
        .updateTable('backstage.Artist')
        .set({
          name: params.name,
          verified: params.verified,
          updatedBy: params.updatedBy,
          updatedAt: new Date(),
        })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()

      await tx.deleteFrom('backstage.ArtistGenre').where('artistId', '=', id).execute()

      await tx
        .insertInto('backstage.ArtistGenre')
        .values(params.genres.map((genre, index) => ({ artistId: id, genreId: genre, position: index })))
        .execute()

      return artist
    })
  }

  findManyGenres(artistIds: string[]): Promise<ArtistGenre[]> {
    return this.database
      .selectFrom('backstage.ArtistGenre')
      .select((eb) => eb.ref('backstage.ArtistGenre.artistId').as('artistId'))
      .innerJoin('backstage.Genre', 'backstage.Genre.id', 'backstage.ArtistGenre.genreId')
      .where('backstage.ArtistGenre.artistId', 'in', artistIds)
      .orderBy('backstage.ArtistGenre.position', 'asc')
      .selectAll('backstage.Genre')
      .execute()
  }
}
