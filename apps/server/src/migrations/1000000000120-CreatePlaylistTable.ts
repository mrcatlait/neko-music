import { MigrationInterface, QueryRunner } from 'typeorm'

import { PlaylistTable } from '@core/tables'

export class CreatePlaylistTable1000000000120 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(PlaylistTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(PlaylistTable.table)
  }
}
