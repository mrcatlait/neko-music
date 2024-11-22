import { ScriptInterface, Sql } from '@common/services/types'

export class v190_CreateRoles implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      INSERT INTO "UserRole" (name, "default")
      VALUES ('user', true), ('admin', false)
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DELETE FROM "UserRole" WHERE name IN ('user', 'admin')
    `
  }
}
