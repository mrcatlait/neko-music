CREATE TYPE "public"."ArtistRole" AS ENUM (
  'PRIMARY',
  'FEATURING',
  'REMIXER'
);

COMMENT ON TYPE "public"."ArtistRole" IS 'The role of an artist';