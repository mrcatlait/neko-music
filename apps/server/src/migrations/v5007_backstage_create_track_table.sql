CREATE TABLE "backstage"."Track" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "catalogTrackId" UUID NOT NULL,
  "albumId" UUID,
  "trackNumber" SMALLINT,
  "diskNumber" SMALLINT,
  "releaseDate" DATE NOT NULL,
  "type" "catalog"."TrackType" NOT NULL DEFAULT 'ORIGINAL',
  "duration" SMALLINT NOT NULL,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  "status" "backstage"."PublishingStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" UUID NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedBy" UUID NOT NULL,
  CONSTRAINT "UK_Track_Name" UNIQUE (name),
  CONSTRAINT "FK_Track_CatalogTrack" FOREIGN KEY ("catalogTrackId") REFERENCES "catalog"."Track" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_Track_Album" FOREIGN KEY ("albumId") REFERENCES "backstage"."Album" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_Track_Duration" CHECK ("duration" > 0 AND "duration" < 36000),
  CONSTRAINT "CHK_Track_Positioning" CHECK (
    ("albumId" IS NULL AND "trackNumber" IS NULL AND "diskNumber" IS NULL) OR
    ("albumId" IS NOT NULL AND "trackNumber" IS NOT NULL AND "trackNumber" > 0 AND "diskNumber" IS NOT NULL AND "diskNumber" > 0)
  )
);

COMMENT ON TABLE "backstage"."Track" IS 'A track';

COMMENT ON COLUMN "backstage"."Track"."id" IS 'The ID of the track';
COMMENT ON COLUMN "backstage"."Track"."name" IS 'The name of the track';
COMMENT ON COLUMN "backstage"."Track"."catalogTrackId" IS 'Foreign key to the catalog track';
COMMENT ON COLUMN "backstage"."Track"."albumId" IS 'Foreign key to the album';
COMMENT ON COLUMN "backstage"."Track"."trackNumber" IS 'The track number of the track';
COMMENT ON COLUMN "backstage"."Track"."diskNumber" IS 'The disk number of the track';
COMMENT ON COLUMN "backstage"."Track"."releaseDate" IS 'The release date of the track';
COMMENT ON COLUMN "backstage"."Track"."type" IS 'The type of the track';
COMMENT ON COLUMN "backstage"."Track"."duration" IS 'The duration of the track';
COMMENT ON COLUMN "backstage"."Track"."explicit" IS 'Whether the track is explicit';
COMMENT ON COLUMN "backstage"."Track"."status" IS 'The status of the publishing process';
COMMENT ON COLUMN "backstage"."Track"."createdAt" IS 'The date and time the track was created';
COMMENT ON COLUMN "backstage"."Track"."createdBy" IS 'The user who created the track';
COMMENT ON COLUMN "backstage"."Track"."updatedAt" IS 'The date and time the track was updated';
COMMENT ON COLUMN "backstage"."Track"."updatedBy" IS 'The user who updated the track';
