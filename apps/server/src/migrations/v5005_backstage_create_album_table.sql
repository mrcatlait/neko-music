CREATE TABLE "backstage"."Album" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "releaseDate" DATE NOT NULL,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  "type" "public"."AlbumType" NOT NULL,
  "status" "backstage"."PublishingStatus" NOT NULL DEFAULT 'DRAFT',
  "artwork" JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" UUID NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedBy" UUID NOT NULL
);

COMMENT ON TABLE "backstage"."Album" IS 'An album';

COMMENT ON COLUMN "backstage"."Album"."id" IS 'The ID of the album';
COMMENT ON COLUMN "backstage"."Album"."name" IS 'The name of the album';
COMMENT ON COLUMN "backstage"."Album"."releaseDate" IS 'The release date of the album';
COMMENT ON COLUMN "backstage"."Album"."explicit" IS 'Whether the album is explicit';
COMMENT ON COLUMN "backstage"."Album"."type" IS 'The type of the album';
COMMENT ON COLUMN "backstage"."Album"."status" IS 'The status of the publishing process';
COMMENT ON COLUMN "backstage"."Album"."artwork" IS 'The artwork of the album';
COMMENT ON COLUMN "backstage"."Album"."createdAt" IS 'The timestamp of the album creation';
COMMENT ON COLUMN "backstage"."Album"."createdBy" IS 'The user who created the album';
COMMENT ON COLUMN "backstage"."Album"."updatedAt" IS 'The timestamp of the album update';
COMMENT ON COLUMN "backstage"."Album"."updatedBy" IS 'The user who updated the album';
