CREATE TABLE "backstage"."Artist" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "verified" BOOLEAN NOT NULL DEFAULT FALSE,
  "status" "backstage"."PublishingStatus" NOT NULL DEFAULT 'DRAFT',
  "artwork" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" UUID NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedBy" UUID NOT NULL
);

COMMENT ON TABLE "backstage"."Artist" IS 'An artist';

COMMENT ON COLUMN "backstage"."Artist"."id" IS 'The ID of the artist';
COMMENT ON COLUMN "backstage"."Artist"."name" IS 'The name of the artist';
COMMENT ON COLUMN "backstage"."Artist"."verified" IS 'Whether the artist is verified';
COMMENT ON COLUMN "backstage"."Artist"."status" IS 'The status of the publishing process';
COMMENT ON COLUMN "backstage"."Artist"."artwork" IS 'The artwork of the artist';
COMMENT ON COLUMN "backstage"."Artist"."createdAt" IS 'The timestamp of the artist creation';
COMMENT ON COLUMN "backstage"."Artist"."createdBy" IS 'The user who created the artist';
COMMENT ON COLUMN "backstage"."Artist"."updatedAt" IS 'The timestamp of the artist update';
COMMENT ON COLUMN "backstage"."Artist"."updatedBy" IS 'The user who updated the artist';