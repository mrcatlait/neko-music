CREATE TYPE "catalog"."ArtistRole" AS ENUM (
  'PRIMARY',
  'FEATURING',
  'REMIXER'
);

COMMENT ON TYPE "catalog"."ArtistRole" IS 'The role of an artist';
