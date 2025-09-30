CREATE TYPE "catalog"."TrackType" AS ENUM (
  'ORIGINAL',
  'EDIT',
  'REMIX',
  'ACOUSTIC',
  'VOCAL',
  'INSTRUMENTAL'
);

COMMENT ON TYPE "catalog"."TrackType" IS 'The type of a track';
