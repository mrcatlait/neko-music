CREATE TYPE "audit"."ResourceType" AS ENUM (
  'ALBUM',
  'ARTIST',
  'TRACK',
  'GENRE',
  'PLAYLIST',
  'USER'
);

COMMENT ON TYPE "audit"."ResourceType" IS 'The type of resource';
