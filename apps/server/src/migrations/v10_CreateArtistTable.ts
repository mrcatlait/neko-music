import { ScriptInterface, Sql } from '@common/services/types'

export class v10_CreateArtistTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "Artist" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(255) NOT NULL UNIQUE,
        "bio" TEXT
      );
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP TABLE IF EXISTS "Artist"
    `
  }
}
