CREATE TABLE "catalog"."Artist" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "artwork" JSONB NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT "UK_Artist_Name" UNIQUE (name)
);

COMMENT ON TABLE "catalog"."Artist" IS 'An artist';

COMMENT ON COLUMN "catalog"."Artist"."id" IS 'The ID of the artist';
COMMENT ON COLUMN "catalog"."Artist"."name" IS 'The name of the artist';
COMMENT ON COLUMN "catalog"."Artist"."artwork" IS 'The artwork of the artist';
COMMENT ON COLUMN "catalog"."Artist"."verified" IS 'Whether the artist is verified';
