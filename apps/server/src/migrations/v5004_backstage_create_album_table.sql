CREATE TABLE "backstage"."Album" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "catalogAlbumId" UUID NOT NULL,
  "releaseDate" DATE NOT NULL,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  "type" "catalog"."AlbumType" NOT NULL,
  "status" "backstage"."PublishingStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" UUID NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedBy" UUID NOT NULL,
  CONSTRAINT "UK_Album_Name" UNIQUE (name),
  CONSTRAINT "FK_Album_CatalogAlbum" FOREIGN KEY ("catalogAlbumId") REFERENCES "catalog"."Album" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "backstage"."Album" IS 'An album';

COMMENT ON COLUMN "backstage"."Album"."id" IS 'The ID of the album';
COMMENT ON COLUMN "backstage"."Album"."name" IS 'The name of the album';
COMMENT ON COLUMN "backstage"."Album"."catalogAlbumId" IS 'Foreign key to the catalog album';
COMMENT ON COLUMN "backstage"."Album"."releaseDate" IS 'The release date of the album';
COMMENT ON COLUMN "backstage"."Album"."explicit" IS 'Whether the album is explicit';
COMMENT ON COLUMN "backstage"."Album"."type" IS 'The type of the album';
COMMENT ON COLUMN "backstage"."Album"."status" IS 'The status of the publishing process';
COMMENT ON COLUMN "backstage"."Album"."createdAt" IS 'The date and time the album was created';
COMMENT ON COLUMN "backstage"."Album"."createdBy" IS 'The user who created the album';
COMMENT ON COLUMN "backstage"."Album"."updatedAt" IS 'The date and time the album was updated';
COMMENT ON COLUMN "backstage"."Album"."updatedBy" IS 'The user who updated the album';
