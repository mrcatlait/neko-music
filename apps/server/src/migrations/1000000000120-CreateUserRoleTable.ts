import { MigrationInterface, QueryRunner } from 'typeorm'

import { UserRoleTable } from '@tables'

export class CreateUserRoleTable1000000000120 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(UserRoleTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(UserRoleTable.table)
  }
}
