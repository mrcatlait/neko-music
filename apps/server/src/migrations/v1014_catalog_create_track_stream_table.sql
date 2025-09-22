CREATE TABLE "catalog"."TrackStream" (
  "trackId" UUID PRIMARY KEY NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_TrackStream_Track" FOREIGN KEY ("trackId") REFERENCES "catalog"."Track" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "catalog"."TrackStream" IS 'A stream of a track';
COMMENT ON COLUMN "catalog"."TrackStream"."trackId" IS 'Foreign key to the track';
COMMENT ON COLUMN "catalog"."TrackStream"."url" IS 'The URL of the stream';
