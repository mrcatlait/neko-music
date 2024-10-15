import { MigrationInterface, QueryRunner } from 'typeorm'

import { AlbumTable } from '@tables'

export class CreateAlbumTable1000000000040 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(AlbumTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(AlbumTable.table)
  }
}
