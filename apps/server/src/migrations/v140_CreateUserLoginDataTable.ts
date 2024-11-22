import { ScriptInterface, Sql } from '@common/services/types'

export class v140_CreateUserLoginDataTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "UserLoginData" (
        "user_id" UUID NOT NULL,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password_hash" VARCHAR(255) NOT NULL,
        CONSTRAINT "FK_UserLoginData_UserAccount" FOREIGN KEY ("user_id") REFERENCES "UserAccount" ("id")
      );
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP TABLE "UserLoginData";
    `
  }
}
