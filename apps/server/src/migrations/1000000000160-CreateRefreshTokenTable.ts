import { MigrationInterface, QueryRunner } from 'typeorm'

import { RefreshTokenTable } from '@tables'

export class CreateRefreshTokenTable1000000000160 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(RefreshTokenTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(RefreshTokenTable.table)
  }
}
