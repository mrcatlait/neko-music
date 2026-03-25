CREATE TABLE "catalog"."Track" (
  "id" UUID PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "albumId" UUID NOT NULL,
  "albumName" VARCHAR(255) NOT NULL,
  "artists" JSONB NOT NULL,
  "trackNumber" SMALLINT NOT NULL,
  "diskNumber" SMALLINT NOT NULL,
  "releaseDate" DATE NOT NULL,
  "type" "public"."TrackType" NOT NULL DEFAULT 'ORIGINAL',
  "duration" SMALLINT NOT NULL,
  "artwork" JSONB NOT NULL,
  "playback" JSONB NOT NULL,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT "FK_Track_Album" FOREIGN KEY ("albumId") REFERENCES "catalog"."Album" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_Track_Duration" CHECK ("duration" >= 0 AND "duration" < 36000),
  CONSTRAINT "CHK_Track_Artists" CHECK (
    jsonb_typeof("artists") = 'array'
    AND jsonb_array_length("artists") >= 1
  ),
  CONSTRAINT "CHK_Track_Positioning" CHECK ("trackNumber" > 0 AND "diskNumber" > 0)
);

COMMENT ON TABLE "catalog"."Track" IS 'A track';

COMMENT ON COLUMN "catalog"."Track"."id" IS 'The ID of the track';
COMMENT ON COLUMN "catalog"."Track"."name" IS 'The name of the track';
COMMENT ON COLUMN "catalog"."Track"."albumId" IS 'Foreign key to the album';
COMMENT ON COLUMN "catalog"."Track"."albumName" IS 'Denormalized album title for list views';
COMMENT ON COLUMN "catalog"."Track"."artists" IS 'Ordered denormalized credits: JSON array of {"id":"<uuid>","name":"<string>"}; ids are catalog Artist PKs for routes; must match TrackArtist rows with role PRIMARY at publish time';
COMMENT ON COLUMN "catalog"."Track"."trackNumber" IS 'The track number of the track';
COMMENT ON COLUMN "catalog"."Track"."diskNumber" IS 'The disk number of the track';
COMMENT ON COLUMN "catalog"."Track"."releaseDate" IS 'The release date of the track';
COMMENT ON COLUMN "catalog"."Track"."type" IS 'The type of the track';
COMMENT ON COLUMN "catalog"."Track"."duration" IS 'The duration of the track';
COMMENT ON COLUMN "catalog"."Track"."artwork" IS 'The artwork of the track';
COMMENT ON COLUMN "catalog"."Track"."playback" IS 'The playback details of the track';
COMMENT ON COLUMN "catalog"."Track"."explicit" IS 'Whether the track is explicit';
