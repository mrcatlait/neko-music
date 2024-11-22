import { ScriptInterface, Sql } from '@common/services/types'

export class v100_CreatePermissionTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "Permission" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "action" VARCHAR(50) NOT NULL UNIQUE,
        "description" VARCHAR(255)
      );
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP TABLE "Permission";
    `
  }
}
