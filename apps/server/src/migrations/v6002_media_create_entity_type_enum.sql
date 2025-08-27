CREATE TYPE "media"."EntityType" AS ENUM (
  'ARTIST',
  'ALBUM',
  'TRACK',
  'PLAYLIST'
);

COMMENT ON TYPE "media"."EntityType" IS 'The type of entity';
