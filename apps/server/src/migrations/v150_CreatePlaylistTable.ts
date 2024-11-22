import { ScriptInterface, Sql } from '@common/services/types'

export class v150_CreatePlaylistTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`  
      CREATE TYPE "PlaylistType" AS ENUM ('private', 'public');
    `

    await sql`
      CREATE TABLE "Playlist" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(255) NOT NULL,
        "description" VARCHAR(255),
        "type" "PlaylistType" NOT NULL,
        "user_id" UUID NOT NULL,
        CONSTRAINT "FK_Playlist_UserAccount" FOREIGN KEY ("user_id") REFERENCES "UserAccount" ("id")
      );
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP TABLE "Playlist";
      DROP TYPE "PlaylistType";
    `
  }
}
