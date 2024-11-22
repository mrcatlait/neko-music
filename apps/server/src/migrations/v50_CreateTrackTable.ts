import { ScriptInterface, Sql } from '@common/services/types'

export class v50_CreateTrackTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "Track" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" VARCHAR(255) NOT NULL UNIQUE,
        "release_date" DATE NOT NULL,
        "album_id" UUID,
        "duration" SMALLINT NOT NULL,
        CONSTRAINT "FK_Track_Album" FOREIGN KEY ("album_id") REFERENCES "Album" ("id")
      );
    `

    await sql`
      CREATE INDEX "IDX_Track_AlbumId" ON "Track" ("album_id");
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP INDEX IF EXISTS "IDX_Track_AlbumId";
    `

    await sql`
      DROP TABLE IF EXISTS "Track";
    `
  }
}
