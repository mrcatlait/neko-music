CREATE TABLE "import"."ImportJob" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "discoveryId" UUID NULL,
  "dataSource" VARCHAR(64) NOT NULL,
  "sourceRef" TEXT NOT NULL,
  "label" VARCHAR(255) NOT NULL,
  "status" "import"."ImportStatus" NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" UUID NOT NULL,
  "startedAt" TIMESTAMP NULL,
  "completedAt" TIMESTAMP NULL,
  CONSTRAINT "UQ_ImportJob_DataSource_SourceRef" UNIQUE ("dataSource", "sourceRef")
);

CREATE INDEX "IDX_ImportJob_Status_CreatedAt" ON "import"."ImportJob" ("status", "createdAt");
CREATE UNIQUE INDEX "UQ_ImportJob_DiscoveryId" ON "import"."ImportJob" ("discoveryId") WHERE "discoveryId" IS NOT NULL;

COMMENT ON TABLE "import"."ImportJob" IS 'An import job for a data source reference';
COMMENT ON COLUMN "import"."ImportJob"."id" IS 'The ID of the import job';
COMMENT ON COLUMN "import"."ImportJob"."discoveryId" IS 'The discovery snapshot that this import job was started from';
COMMENT ON COLUMN "import"."ImportJob"."dataSource" IS 'The data source of the import';
COMMENT ON COLUMN "import"."ImportJob"."sourceRef" IS 'The reference to the source data';
COMMENT ON COLUMN "import"."ImportJob"."label" IS 'The label of the import';
COMMENT ON COLUMN "import"."ImportJob"."status" IS 'The status of the import job';
COMMENT ON COLUMN "import"."ImportJob"."createdAt" IS 'The timestamp when the import job was created';
COMMENT ON COLUMN "import"."ImportJob"."createdBy" IS 'The user who created the import job';
COMMENT ON COLUMN "import"."ImportJob"."startedAt" IS 'The timestamp when the import job started';
COMMENT ON COLUMN "import"."ImportJob"."completedAt" IS 'The timestamp when the import job completed';
