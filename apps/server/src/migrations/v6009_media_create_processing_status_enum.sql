CREATE TYPE "media"."ProcessingStatus" AS ENUM (
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED'
);

COMMENT ON TYPE "media"."ProcessingStatus" IS 'The status of the media processing';
