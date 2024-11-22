import { Permission } from '@neko/permissions'

import { ScriptInterface, Sql } from '@common/services/types'

export class v180_AddPermissions implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    for (const permission of Object.values(Permission)) {
      await sql`
        INSERT INTO "Permission" (action)
        VALUES (${permission})
      `
    }
  }

  async down(sql: Sql): Promise<void> {
    for (const permission of Object.values(Permission)) {
      await sql`
        DELETE FROM "Permission" WHERE action = ${permission}
      `
    }
  }
}
