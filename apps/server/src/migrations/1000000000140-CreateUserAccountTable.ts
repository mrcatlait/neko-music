import { MigrationInterface, QueryRunner } from 'typeorm'

import { UserAccountTable } from '@tables'

export class CreateUserAccountTable1000000000140 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(UserAccountTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(UserAccountTable.table)
  }
}
