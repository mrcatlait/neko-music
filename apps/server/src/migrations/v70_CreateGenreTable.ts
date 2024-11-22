import { ScriptInterface, Sql } from '@common/services/types'

export class v70_CreateGenreTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "Genre" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(255) NOT NULL UNIQUE
      );
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP TABLE IF EXISTS "Genre";
    `
  }
}
