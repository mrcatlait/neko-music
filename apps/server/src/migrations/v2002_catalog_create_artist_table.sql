CREATE TABLE "catalog"."Artist" (
  "id" UUID PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "artwork" JSONB NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT FALSE
  -- Optional precomputed fields:
  -- - popularity
  -- - followers
  -- - genres
  -- - albums
  -- - tracks
  -- - playlists
  -- - playlists
);

COMMENT ON TABLE "catalog"."Artist" IS 'An artist';

COMMENT ON COLUMN "catalog"."Artist"."id" IS 'The ID of the artist';
COMMENT ON COLUMN "catalog"."Artist"."name" IS 'The name of the artist';
COMMENT ON COLUMN "catalog"."Artist"."artwork" IS 'The artwork of the artist';
COMMENT ON COLUMN "catalog"."Artist"."verified" IS 'Whether the artist is verified';
