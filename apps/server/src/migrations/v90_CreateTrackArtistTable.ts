import { ScriptInterface, Sql } from '@common/services/types'

export class v90_CreateTrackArtistTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TYPE "ArtistRole" AS ENUM ('featuring', 'primary', 'producer', 'remixer');
    `

    await sql`
      CREATE TABLE "TrackArtist" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "track_id" UUID NOT NULL,
        "artist_id" UUID NOT NULL,
        "role" "ArtistRole" NOT NULL,
        CONSTRAINT "FK_TrackArtist_Track" FOREIGN KEY ("track_id") REFERENCES "Track" ("id"),
        CONSTRAINT "FK_TrackArtist_Artist" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id"),
        CONSTRAINT "UQ_TrackArtist_Track_Artist_Role" UNIQUE ("track_id", "artist_id", "role")
      );
    `

    await sql`
      CREATE INDEX "IDX_TrackArtist_TrackId" ON "TrackArtist" ("track_id");
    `

    await sql`
      CREATE INDEX "IDX_TrackArtist_ArtistId" ON "TrackArtist" ("artist_id");
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP INDEX IF EXISTS "IDX_TrackArtist_ArtistId";
    `

    await sql`
      DROP INDEX IF EXISTS "IDX_TrackArtist_TrackId";
    `

    await sql`
      DROP TABLE IF EXISTS "TrackArtist";
    `

    await sql`
      DROP TYPE IF EXISTS "ArtistRole";
    `
  }
}
