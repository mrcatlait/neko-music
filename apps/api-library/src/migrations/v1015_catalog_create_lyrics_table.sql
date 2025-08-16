CREATE TABLE "catalog"."Lyrics" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "trackId" UUID NOT NULL,
  "lyrics" TEXT NOT NULL,
  "synced" BOOLEAN NOT NULL DEFAULT FALSE,
  "status" "catalog"."RecordStatus" NOT NULL DEFAULT 'DRAFT',
  CONSTRAINT "FK_Lyrics_Track" FOREIGN KEY ("trackId") REFERENCES "catalog"."Track" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "catalog"."Lyrics" IS 'A lyrics';
COMMENT ON COLUMN "catalog"."Lyrics"."trackId" IS 'Foreign key to the track';
COMMENT ON COLUMN "catalog"."Lyrics"."lyrics" IS 'The lyrics of the track in TTML format';
COMMENT ON COLUMN "catalog"."Lyrics"."synced" IS 'Whether the lyrics are synced';
COMMENT ON COLUMN "catalog"."Lyrics"."status" IS 'The status of the lyrics';
