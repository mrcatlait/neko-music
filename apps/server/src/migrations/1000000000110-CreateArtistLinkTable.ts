import { MigrationInterface, QueryRunner } from 'typeorm'

import { ArtistLinkTable } from '@core/tables'

export class CreateArtistLinkTable1000000000110 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(ArtistLinkTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(ArtistLinkTable.table)
  }
}
