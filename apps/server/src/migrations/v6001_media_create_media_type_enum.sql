CREATE TYPE "media"."MediaType" AS ENUM (
  'ARTWORK',
  'AUDIO'
);

COMMENT ON TYPE "media"."MediaType" IS 'The type of media';
