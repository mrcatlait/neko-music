CREATE TYPE "public"."AlbumType" AS ENUM (
  'ALBUM',
  'SINGLE',
  'COMPILATION',
  'EP',
  'OTHER'
);

COMMENT ON TYPE "public"."AlbumType" IS 'The type of an album';
