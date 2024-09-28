import { In, QueryRunner } from 'typeorm'

import { SeedInterface } from '@core/services'
import { GenreEntity } from '@features/track/entities'

export class CreateGenres1000000000010 implements SeedInterface {
  private readonly genres = [
    'Alternative',
    'Anime',
    'Blues',
    'Children',
    'Classical',
    'Commercial',
    'Country',
    'Dance',
    'Electronic',
    'Folk',
    'Hip-Hop',
    'Instrumental',
    'J-Pop',
    'Jazz',
    'K-Pop',
    'Latin',
    'Metal',
    'Opera',
    'Pop',
    'R&B and Soul',
    'Reggae',
    'Rock',
    'Soundtrack',
    // Languages
    'Russian',
    'Japanese',
  ]

  async up(queryRunner: QueryRunner): Promise<void> {
    const genreEntities = this.genres.map((name) => queryRunner.manager.create(GenreEntity, { name }))
    await queryRunner.manager.save(genreEntities)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(GenreEntity, { name: In(this.genres) })
  }
}
