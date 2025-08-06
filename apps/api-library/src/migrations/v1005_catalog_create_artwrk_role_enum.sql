CREATE TYPE "catalog"."ArtworkRole" AS ENUM (
  "COVER",
  "BANNER"
);

COMMENT ON TYPE "catalog"."ArtworkRole" IS 'The role of an artwork';
