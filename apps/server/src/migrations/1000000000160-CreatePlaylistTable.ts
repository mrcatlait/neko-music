import { MigrationInterface, QueryRunner } from 'typeorm'

import { PlaylistTable } from '@tables'

export class CreatePlaylistTable1000000000160 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(PlaylistTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(PlaylistTable.table)
  }
}
