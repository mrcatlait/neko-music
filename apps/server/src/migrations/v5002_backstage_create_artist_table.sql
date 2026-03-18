CREATE TABLE "backstage"."Artist" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "catalogArtistId" UUID,
  "verified" BOOLEAN NOT NULL DEFAULT FALSE,
  "status" "backstage"."PublishingStatus" NOT NULL DEFAULT 'DRAFT',
  CONSTRAINT "UK_Artist_Name" UNIQUE (name),
  CONSTRAINT "FK_Artist_CatalogArtist" FOREIGN KEY ("catalogArtistId") REFERENCES "catalog"."Artist" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_Artist_CatalogArtistId" CHECK (
    ("catalogArtistId" IS NOT NULL AND "status" = 'PUBLISHED') OR
    ("catalogArtistId" IS NULL AND "status" IN ('DRAFT', 'PROCESSING', 'READY', 'REJECTED'))
  )

);

COMMENT ON TABLE "backstage"."Artist" IS 'An artist';

COMMENT ON COLUMN "backstage"."Artist"."id" IS 'The ID of the artist';
COMMENT ON COLUMN "backstage"."Artist"."name" IS 'The name of the artist';
COMMENT ON COLUMN "backstage"."Artist"."catalogArtistId" IS 'Foreign key to the catalog artist';
COMMENT ON COLUMN "backstage"."Artist"."verified" IS 'Whether the artist is verified';
COMMENT ON COLUMN "backstage"."Artist"."status" IS 'The status of the publishing process';
