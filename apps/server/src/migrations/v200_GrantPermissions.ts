import { Permission } from '@neko/permissions'

import { ScriptInterface, Sql } from '@common/services/types'

interface PermissionRow {
  id: number
  action: Permission
}

export class v200_GrantPermissions implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    const [userRole] = await sql<{ id: string }[]>`SELECT id FROM "UserRole" WHERE name = 'user' LIMIT 1`
    const [adminRole] = await sql<{ id: string }[]>`SELECT id FROM "UserRole" WHERE name = 'admin' LIMIT 1`

    const permissions = await sql<PermissionRow[]>`SELECT id, action FROM "Permission"`

    const userPermissions = permissions.filter((permission: PermissionRow) =>
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
      ].includes(permission.action),
    )

    const adminPermissions = permissions

    for (const permission of userPermissions) {
      await sql`INSERT INTO "GrantedPermission" (role_id, permission_id) VALUES (${userRole.id}, ${permission.id})`
    }

    for (const permission of adminPermissions) {
      await sql`INSERT INTO "GrantedPermission" (role_id, permission_id) VALUES (${adminRole.id}, ${permission.id})`
    }
  }

  async down(sql: Sql): Promise<void> {
    await sql`DELETE FROM "GrantedPermission"`
  }
}
