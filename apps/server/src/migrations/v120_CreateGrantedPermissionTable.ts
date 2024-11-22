import { ScriptInterface, Sql } from '@common/services/types'

export class v120_CreateGrantedPermissionTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "GrantedPermission" (
        "role_id" UUID NOT NULL,
        "permission_id" UUID NOT NULL,
        PRIMARY KEY ("role_id", "permission_id"),
        CONSTRAINT "FK_GrantedPermission_UserRole" FOREIGN KEY ("role_id") REFERENCES "UserRole" ("id"),
        CONSTRAINT "FK_GrantedPermission_Permission" FOREIGN KEY ("permission_id") REFERENCES "Permission" ("id")
      );
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP TABLE "GrantedPermission";
    `
  }
}
