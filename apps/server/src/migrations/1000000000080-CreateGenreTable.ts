import { MigrationInterface, QueryRunner } from 'typeorm'

import { GenreTable } from '@core/tables'

export class CreateGenreTable1000000000080 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(GenreTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(GenreTable.table)
  }
}
