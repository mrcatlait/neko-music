CREATE TYPE "media"."MediaType" AS ENUM (
  'IMAGE',
  'AUDIO'
);

COMMENT ON TYPE "media"."MediaType" IS 'The type of media';
