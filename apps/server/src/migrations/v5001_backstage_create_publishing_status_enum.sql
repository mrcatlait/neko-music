CREATE TYPE "backstage"."PublishingStatus" AS ENUM (
  'DRAFT',
  'PROCESSING',
  'READY',
  'PUBLISHED',
  'REJECTED'
);

COMMENT ON TYPE "backstage"."PublishingStatus" IS 'The status of the publishing process';
