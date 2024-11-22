import { ScriptInterface, Sql } from '@common/services/types'

export class v40_CreateAlbumImageTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "AlbumImage" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "album_id" UUID NOT NULL,
        "resolution" VARCHAR(255) NOT NULL,
        "url" VARCHAR(255) NOT NULL,
        CONSTRAINT "FK_AlbumImage_Album" FOREIGN KEY ("album_id") REFERENCES "Album" ("id")
      );
    `

    await sql`
      CREATE INDEX "IDX_AlbumImage_AlbumId" ON "AlbumImage" ("album_id");
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP INDEX IF EXISTS "IDX_AlbumImage_AlbumId";
    `

    await sql`
      DROP TABLE IF EXISTS "AlbumImage";
    `
  }
}
