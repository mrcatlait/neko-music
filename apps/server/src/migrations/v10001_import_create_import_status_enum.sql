CREATE TYPE "import"."ImportStatus" AS ENUM (
  'pending',
  'in_progress',
  'cancel_requested',
  'canceled',
  'completed',
  'failed'
);

COMMENT ON TYPE "import"."ImportStatus" IS 'The status of an import job or import job item';
