import { MigrationInterface, QueryRunner } from 'typeorm'

import { PermissionTable } from '@tables'

export class CreatePermissionTable1000000000110 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(PermissionTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(PermissionTable.table)
  }
}
