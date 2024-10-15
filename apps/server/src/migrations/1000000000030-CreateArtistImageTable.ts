import { MigrationInterface, QueryRunner } from 'typeorm'

import { ArtistImageTable } from '@tables'

export class CreateArtistImageTable1000000000030 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(ArtistImageTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(ArtistImageTable.table)
  }
}
