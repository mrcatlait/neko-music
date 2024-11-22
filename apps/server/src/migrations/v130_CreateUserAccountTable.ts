import { ScriptInterface, Sql } from '@common/services/types'

export class v130_CreateUserAccountTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "UserAccount" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "username" VARCHAR(255) NOT NULL UNIQUE,
        "role_id" UUID NOT NULL,
        CONSTRAINT "FK_UserAccount_UserRole" FOREIGN KEY ("role_id") REFERENCES "UserRole" ("id")
      );
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP TABLE "UserAccount";
    `
  }
}
