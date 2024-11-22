import { ScriptInterface, Sql } from '@common/services/types'

export class v30_CreateAlbumTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "Album" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" VARCHAR(255) NOT NULL UNIQUE,
        "artist_id" UUID NOT NULL,
        "release_date" DATE NOT NULL,
        CONSTRAINT "FK_Album_Artist" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id")
      );
    `

    await sql`
      CREATE INDEX "IDX_Album_ArtistId" ON "Album" ("artist_id");
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP INDEX IF EXISTS "IDX_Album_ArtistId";
    `

    await sql`
      DROP TABLE IF EXISTS "Album";
    `
  }
}
