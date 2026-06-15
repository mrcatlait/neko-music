ALTER TABLE "import"."ImportJob"
ADD COLUMN IF NOT EXISTS "label" VARCHAR(255) NOT NULL DEFAULT 'Import';

COMMENT ON COLUMN "import"."ImportJob"."label" IS 'The label of the import';
