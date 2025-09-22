CREATE TABLE "catalog"."Album" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "releaseDate" DATE NOT NULL,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  "type" "catalog"."AlbumType" NOT NULL DEFAULT 'ALBUM'
);

COMMENT ON TABLE "catalog"."Album" IS 'An album';
COMMENT ON COLUMN "catalog"."Album"."name" IS 'The name of the album';
COMMENT ON COLUMN "catalog"."Album"."releaseDate" IS 'The release date of the album';
COMMENT ON COLUMN "catalog"."Album"."explicit" IS 'Whether the album is explicit';
COMMENT ON COLUMN "catalog"."Album"."type" IS 'The type of the album';
