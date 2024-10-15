import { MigrationInterface, QueryRunner } from 'typeorm'

import { GrantedPermissionTable } from '@tables'

export class CreateGrantedPermissionTable1000000000130 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(GrantedPermissionTable.table)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(GrantedPermissionTable.table)
  }
}
