CREATE TABLE "catalog"."Track" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "albumId" UUID,
  "trackNumber" SMALLINT,
  "diskNumber" SMALLINT,
  "releaseDate" DATE NOT NULL,
  "type" "catalog"."TrackType" NOT NULL DEFAULT 'ORIGINAL',
  "originalTrackId" UUID,
  "duration" SMALLINT NOT NULL,
  "artwork" JSONB NOT NULL,
  "playback" JSONB NOT NULL,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT "FK_Track_Album" FOREIGN KEY ("albumId") REFERENCES "catalog"."Album" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_Track_OriginalTrack" FOREIGN KEY ("originalTrackId") REFERENCES "catalog"."Track" ("id"),
  CONSTRAINT "CHK_Track_Duration" CHECK ("duration" > 0 AND "duration" < 36000),
  CONSTRAINT "CHK_Track_Positioning" CHECK (
    ("albumId" IS NULL AND "trackNumber" IS NULL AND "diskNumber" IS NULL) OR
    ("albumId" IS NOT NULL AND "trackNumber" IS NOT NULL AND "trackNumber" > 0 AND "diskNumber" IS NOT NULL AND "diskNumber" > 0)
  ),
  CONSTRAINT "UQ_Track_AlbumId_DiskNumber_TrackNumber" UNIQUE ("albumId", "diskNumber", "trackNumber")
);

COMMENT ON TABLE "catalog"."Track" IS 'A track';
COMMENT ON COLUMN "catalog"."Track"."name" IS 'The name of the track';
COMMENT ON COLUMN "catalog"."Track"."albumId" IS 'Foreign key to the album';
COMMENT ON COLUMN "catalog"."Track"."trackNumber" IS 'The track number of the track';
COMMENT ON COLUMN "catalog"."Track"."diskNumber" IS 'The disk number of the track';
COMMENT ON COLUMN "catalog"."Track"."releaseDate" IS 'The release date of the track';
COMMENT ON COLUMN "catalog"."Track"."duration" IS 'The duration of the track';
COMMENT ON COLUMN "catalog"."Track"."explicit" IS 'Whether the track is explicit';
