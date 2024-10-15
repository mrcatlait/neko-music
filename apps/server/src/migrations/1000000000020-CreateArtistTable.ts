import { MigrationInterface, QueryRunner } from 'typeorm'

import { ArtistTable } from '@tables'

export class CreateArtistTable1000000000020 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(ArtistTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(ArtistTable.table)
  }
}
