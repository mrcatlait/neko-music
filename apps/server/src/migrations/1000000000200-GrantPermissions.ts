import { In, QueryRunner } from 'typeorm'
import { Permission } from '@neko/permissions'

import { SeedInterface } from '@modules/database-seed/types'
import { GrantedPermissionEntity, PermissionEntity, UserRoleEntity } from '@modules/authorization/entities'

export class GrantPermissions1000000000200 implements SeedInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const roles = await queryRunner.manager.find(UserRoleEntity, {})
    const userRole = roles.find((role) => role.name === 'user')
    const adminRole = roles.find((role) => role.name === 'admin')

    if (!userRole || !adminRole) {
      throw new Error(`Failed to find user and admin roles`)
    }

    const permissions = await queryRunner.manager.find(PermissionEntity, {})

    const userPermissions = permissions.filter((permission) =>
      [
        Permission.TrackDownload,
        Permission.LibraryRead,
        Permission.LibraryUpdate,
        Permission.PlaylistRead,
        Permission.PlaylistCreate,
        Permission.PlaylistUpdate,
        Permission.PlaylistDelete,
        Permission.PlaylistFollow,
        Permission.AlbumDownload,
        Permission.ArtistFollow,
        Permission.UserRead,
        Permission.UserUpdate,
      ].includes(permission.action as Permission),
    )

    const userGrantPermissions = userPermissions.map((permission) =>
      queryRunner.manager.create(GrantedPermissionEntity, {
        permissionId: permission.id,
        roleId: userRole.id,
      }),
    )

    const adminPermissions = permissions

    const adminGrantPermissions = adminPermissions.map((permission) =>
      queryRunner.manager.create(GrantedPermissionEntity, {
        permissionId: permission.id,
        roleId: adminRole.id,
      }),
    )

    await queryRunner.manager.save([...userGrantPermissions, ...adminGrantPermissions])
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const roles = await queryRunner.manager.find(UserRoleEntity, {})
    const userRole = roles.find((role) => role.name === 'user')
    const adminRole = roles.find((role) => role.name === 'admin')

    if (!userRole || !adminRole) {
      throw new Error(`Failed to find user and admin roles`)
    }

    await queryRunner.manager.delete(GrantedPermissionEntity, { roleId: In([userRole.id, adminRole.id]) })
  }
}
