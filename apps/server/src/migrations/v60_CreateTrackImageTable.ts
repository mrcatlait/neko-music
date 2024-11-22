import { ScriptInterface, Sql } from '@common/services/types'

export class v60_CreateTrackImageTable implements ScriptInterface {
  async up(sql: Sql): Promise<void> {
    await sql`
      CREATE TABLE "TrackImage" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "track_id" UUID NOT NULL,
        "resolution" VARCHAR(255) NOT NULL,
        "url" VARCHAR(255) NOT NULL,
        CONSTRAINT "FK_TrackImage_Track" FOREIGN KEY ("track_id") REFERENCES "Track" ("id")
      );
    `

    await sql`
      CREATE INDEX "IDX_TrackImage_TrackId" ON "TrackImage" ("track_id");
    `
  }

  async down(sql: Sql): Promise<void> {
    await sql`
      DROP INDEX IF EXISTS "IDX_TrackImage_TrackId";
    `

    await sql`
      DROP TABLE IF EXISTS "TrackImage";
    `
  }
}
