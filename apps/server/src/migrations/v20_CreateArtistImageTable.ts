import { ScriptInterface, Sql } from '@common/services/types'

export class v20_CreateArtistImageTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "ArtistImage" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "artist_id" UUID NOT NULL,
        "resolution" VARCHAR(255) NOT NULL,
        "url" VARCHAR(255) NOT NULL,
        CONSTRAINT "FK_ArtistImage_Artist" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id")
      );
    `

    await sql`
      CREATE INDEX "IDX_ArtistImage_ArtistId" ON "ArtistImage" ("artist_id");
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP INDEX IF EXISTS "IDX_ArtistImage_ArtistId"
    `

    await sql`
      DROP TABLE IF EXISTS "ArtistImage";
    `
  }
}
