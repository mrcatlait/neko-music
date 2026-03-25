CREATE TYPE "public"."TrackType" AS ENUM (
  'ORIGINAL',
  'EDIT',
  'REMIX',
  'ACOUSTIC',
  'VOCAL',
  'INSTRUMENTAL'
);

COMMENT ON TYPE "public"."TrackType" IS 'The type of a track';
