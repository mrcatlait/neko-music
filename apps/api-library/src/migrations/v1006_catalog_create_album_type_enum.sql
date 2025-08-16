CREATE TYPE "catalog"."AlbumType" AS ENUM (
  'ALBUM',
  'SINGLE',
  'COMPILATION',
  'EP',
  'OTHER'
);

COMMENT ON TYPE "catalog"."AlbumType" IS 'The type of an album';
