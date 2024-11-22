import { ScriptInterface, Sql } from '@common/services/types'

export class v170_CreatePlaylistImageTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "PlaylistImage" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "playlist_id" UUID NOT NULL,
        "resolution" VARCHAR(255) NOT NULL,
        "url" VARCHAR(255) NOT NULL,
        CONSTRAINT "FK_PlaylistImage_Playlist" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id")
      );
    `

    await sql`
      CREATE INDEX "IDX_PlaylistImage_PlaylistId" ON "PlaylistImage" ("playlist_id");
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP INDEX IF EXISTS "IDX_PlaylistImage_PlaylistId";
    `

    await sql`
      DROP TABLE IF EXISTS "PlaylistImage";
    `
  }
}
