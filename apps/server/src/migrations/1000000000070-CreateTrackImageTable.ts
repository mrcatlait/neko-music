import { MigrationInterface, QueryRunner } from 'typeorm'

import { TrackImageTable } from '@tables'

export class CreateTrackImageTable1000000000070 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(TrackImageTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TrackImageTable.table)
  }
}
