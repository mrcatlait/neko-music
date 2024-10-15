import { MigrationInterface, QueryRunner } from 'typeorm'

import { TrackGenreTable } from '@tables'

export class CreateTrackGenreTable1000000000090 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(TrackGenreTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TrackGenreTable.table)
  }
}
