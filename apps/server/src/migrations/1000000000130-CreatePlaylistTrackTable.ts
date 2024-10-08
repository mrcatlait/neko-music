import { MigrationInterface, QueryRunner } from 'typeorm'

import { PlaylistTrackTable } from '@core/tables'

export class CreatePlaylistTrackTable1000000000130 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(PlaylistTrackTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(PlaylistTrackTable.table)
  }
}
