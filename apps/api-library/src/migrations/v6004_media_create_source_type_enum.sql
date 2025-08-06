CREATE TYPE "media"."SourceType" AS ENUM (
  'DIRECT_UPLOAD',
  'YOUTUBE_LINK',
  'EXTERNAL_URL'
);

COMMENT ON TYPE "media"."SourceType" IS 'The type of media source';
