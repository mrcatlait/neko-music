import { MigrationInterface, QueryRunner } from 'typeorm'

import { PlaylistTrackTable } from '@tables'

export class CreatePlaylistTrackTable1000000000170 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(PlaylistTrackTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(PlaylistTrackTable.table)
  }
}
