CREATE TABLE "catalog"."Album" (
  "id" UUID PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "releaseDate" DATE NOT NULL,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  "artwork" JSONB NOT NULL,
  "type" "public"."AlbumType" NOT NULL,
  "artists" JSONB NOT NULL,
  CONSTRAINT "CHK_Album_Artists" CHECK (
    jsonb_typeof("artists") = 'array'
    AND jsonb_array_length("artists") >= 1
  )
);

COMMENT ON TABLE "catalog"."Album" IS 'An album';

COMMENT ON COLUMN "catalog"."Album"."id" IS 'The ID of the album';
COMMENT ON COLUMN "catalog"."Album"."name" IS 'The name of the album';
COMMENT ON COLUMN "catalog"."Album"."releaseDate" IS 'The release date of the album';
COMMENT ON COLUMN "catalog"."Album"."explicit" IS 'Whether the album is explicit';
COMMENT ON COLUMN "catalog"."Album"."artwork" IS 'The artwork of the album';
COMMENT ON COLUMN "catalog"."Album"."type" IS 'The type of the album';
COMMENT ON COLUMN "catalog"."Album"."artists" IS 'Ordered denormalized credits: JSON array of {"id":"<uuid>","name":"<string>"}; ids are catalog Artist PKs for routes; must match TrackArtist rows with role PRIMARY at publish time';
