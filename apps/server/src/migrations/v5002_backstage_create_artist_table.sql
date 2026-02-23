CREATE TABLE "catalog"."Artist" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "catalogArtistId" UUID,
  "verified" BOOLEAN NOT NULL DEFAULT FALSE,
  "status" "backstage"."PublishingStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" UUID NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedBy" UUID NOT NULL,
  CONSTRAINT "UK_Artist_Name" UNIQUE (name),
  CONSTRAINT "FK_Artist_CatalogArtist" FOREIGN KEY ("catalogArtistId") REFERENCES "catalog"."Artist" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_Artist_CatalogArtistId" CHECK (
    ("catalogArtistId" IS NOT NULL AND "status" = 'PUBLISHED') OR
    ("catalogArtistId" IS NULL AND "status" IN ('DRAFT', 'PROCESSING', 'REJECTED'))
  )
);

COMMENT ON TABLE "backstage"."Artist" IS 'An artist';

COMMENT ON COLUMN "backstage"."Artist"."id" IS 'The ID of the artist';
COMMENT ON COLUMN "backstage"."Artist"."name" IS 'The name of the artist';
COMMENT ON COLUMN "backstage"."Artist"."catalogArtistId" IS 'Foreign key to the catalog artist';
COMMENT ON COLUMN "backstage"."Artist"."verified" IS 'Whether the artist is verified';
COMMENT ON COLUMN "backstage"."Artist"."status" IS 'The status of the publishing process';
COMMENT ON COLUMN "backstage"."Artist"."createdAt" IS 'The date and time the artist was created';
COMMENT ON COLUMN "backstage"."Artist"."createdBy" IS 'The user who created the artist';
COMMENT ON COLUMN "backstage"."Artist"."updatedAt" IS 'The date and time the artist was updated';
COMMENT ON COLUMN "backstage"."Artist"."updatedBy" IS 'The user who updated the artist';
