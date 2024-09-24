import { MigrationInterface, QueryRunner } from 'typeorm'

import { TrackTable } from '@core/tables'

export class CreateTrackTable1000000000060 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(TrackTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(TrackTable.table)
  }
}
