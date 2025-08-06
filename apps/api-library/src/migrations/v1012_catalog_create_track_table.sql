CREATE TABLE "catalog"."Track" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "albumId" UUID NOT NULL,
  "trackNumber" SMALLINT NOT NULL,
  "diskNumber" SMALLINT NOT NULL,
  "releaseDate" DATE NOT NULL,
  "duration" SMALLINT NOT NULL,
  "hasLyrics" BOOLEAN NOT NULL DEFAULT FALSE,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  "status" "catalog"."RecordStatus" NOT NULL DEFAULT 'DRAFT',
  CONSTRAINT "FK_Track_Album" FOREIGN KEY ("albumId") REFERENCES "catalog"."Album" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_Track_TrackNumber" CHECK (trackNumber > 0),
  CONSTRAINT "CHK_Track_DiskNumber" CHECK (diskNumber > 0),
  CONSTRAINT "CHK_Track_Duration" CHECK (duration > 0 AND duration < 36000)
);

COMMENT ON TABLE "catalog"."Track" IS 'A track';
COMMENT ON COLUMN "catalog"."Track"."name" IS 'The name of the track';
COMMENT ON COLUMN "catalog"."Track"."albumId" IS 'Foreign key to the album';
COMMENT ON COLUMN "catalog"."Track"."trackNumber" IS 'The track number of the track';
COMMENT ON COLUMN "catalog"."Track"."diskNumber" IS 'The disk number of the track';
COMMENT ON COLUMN "catalog"."Track"."releaseDate" IS 'The release date of the track';
COMMENT ON COLUMN "catalog"."Track"."duration" IS 'The duration of the track';
COMMENT ON COLUMN "catalog"."Track"."hasLyrics" IS 'Whether the track has lyrics';
COMMENT ON COLUMN "catalog"."Track"."explicit" IS 'Whether the track is explicit';
COMMENT ON COLUMN "catalog"."Track"."status" IS 'The status of the track';
