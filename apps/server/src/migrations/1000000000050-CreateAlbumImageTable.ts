import { MigrationInterface, QueryRunner } from 'typeorm'

import { AlbumImageTable } from '@core/tables'

export class CreateAlbumImageTable1000000000050 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(AlbumImageTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(AlbumImageTable.table)
  }
}
