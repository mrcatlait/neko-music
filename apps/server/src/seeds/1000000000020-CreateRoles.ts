import { In, QueryRunner } from 'typeorm'

import { SeedInterface } from '@modules/database-seed/types'
import { UserRoleEntity } from '@modules/authorization/entities'

export class CreateRoles1000000000020 implements SeedInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const userRole = queryRunner.manager.create(UserRoleEntity, {
      name: 'user',
    })
    const adminRole = queryRunner.manager.create(UserRoleEntity, {
      name: 'admin',
    })
    const roleEntities: UserRoleEntity[] = [userRole, adminRole]

    await queryRunner.manager.save(roleEntities)
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(UserRoleEntity, { name: In(['user', 'admin']) })
  }
}
