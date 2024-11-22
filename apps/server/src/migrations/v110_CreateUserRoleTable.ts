import { ScriptInterface, Sql } from '@common/services/types'

export class v110_CreateUserRoleTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "UserRole" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(20) NOT NULL UNIQUE,
        "description" VARCHAR(255),
        "default" BOOLEAN NOT NULL DEFAULT FALSE
      );
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP TABLE "UserRole";
    `
  }
}
