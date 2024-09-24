import { MigrationInterface, QueryRunner } from 'typeorm'

import { GenreTable } from '@core/tables'
import { GenreEntity } from '@features/track/entities'

export class CreateGenreTable1000000000080 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(GenreTable.table)

    const genres = [
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

    const genreEntities = genres.map((name) => queryRunner.manager.create(GenreEntity, { name }))
    queryRunner.manager.save(genreEntities)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(GenreTable.table)
  }
}
