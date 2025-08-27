CREATE TYPE "catalog"."RecordStatus" AS ENUM (
  'DRAFT',
  'PUBLISHED',
  'ARCHIVED'
);

COMMENT ON TYPE "catalog"."RecordStatus" IS 'The status of a record';
