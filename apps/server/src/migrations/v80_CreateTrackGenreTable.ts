import { ScriptInterface, Sql } from '@common/services/types'

export class v80_CreateTrackGenreTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "TrackGenre" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "track_id" UUID NOT NULL,
        "genre_id" UUID NOT NULL,
        CONSTRAINT "FK_TrackGenre_Track" FOREIGN KEY ("track_id") REFERENCES "Track" ("id"),
        CONSTRAINT "FK_TrackGenre_Genre" FOREIGN KEY ("genre_id") REFERENCES "Genre" ("id"),
        CONSTRAINT "UQ_TrackGenre_Track_Genre" UNIQUE ("track_id", "genre_id")
      );
    `

    await sql`
      CREATE INDEX "IDX_TrackGenre_TrackId" ON "TrackGenre" ("track_id");
    `

    await sql`
      CREATE INDEX "IDX_TrackGenre_GenreId" ON "TrackGenre" ("genre_id");
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP INDEX IF EXISTS "IDX_TrackGenre_GenreId";
    `

    await sql`
      DROP INDEX IF EXISTS "IDX_TrackGenre_TrackId";
    `

    await sql`
      DROP TABLE IF EXISTS "TrackGenre";
    `
  }
}
