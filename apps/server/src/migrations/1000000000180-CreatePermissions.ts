import { In, QueryRunner } from 'typeorm'
import { Permission } from '@neko/permissions'

import { SeedInterface } from '@modules/database-seed/types'
import { PermissionEntity } from '@modules/authorization/entities'

export class CreatePermissions1000000000180 implements SeedInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const permissionEntities: PermissionEntity[] = Object.values(Permission).map((permission) =>
      queryRunner.manager.create(PermissionEntity, {
        action: permission,
      }),
    )

    await queryRunner.manager.save(permissionEntities)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(PermissionEntity, { action: In(Object.values(Permission)) })
  }
}
