CREATE TABLE "import"."ImportJobItem" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "jobId" UUID NOT NULL,
  "sourceItemRef" TEXT NOT NULL,
  "label" VARCHAR(255) NOT NULL,
  "status" "import"."ImportStatus" NOT NULL DEFAULT 'pending',
  "audioPath" TEXT NULL,
  "artworkPath" TEXT NULL,
  "errorMessage" VARCHAR(255) NULL,
  "startedAt" TIMESTAMP NULL,
  "completedAt" TIMESTAMP NULL,
  CONSTRAINT "FK_ImportJobItem_ImportJob" FOREIGN KEY ("jobId") REFERENCES "import"."ImportJob" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_ImportJobItem_JobId_SourceItemRef" UNIQUE ("jobId", "sourceItemRef")
);

CREATE INDEX "IDX_ImportJobItem_JobId_Status" ON "import"."ImportJobItem" ("jobId", "status");

COMMENT ON TABLE "import"."ImportJobItem" IS 'A source item within an import job';
COMMENT ON COLUMN "import"."ImportJobItem"."id" IS 'The ID of the import job item';
COMMENT ON COLUMN "import"."ImportJobItem"."jobId" IS 'Foreign key to the import job';
COMMENT ON COLUMN "import"."ImportJobItem"."sourceItemRef" IS 'The reference to the source item';
COMMENT ON COLUMN "import"."ImportJobItem"."label" IS 'The label of the import job item';
COMMENT ON COLUMN "import"."ImportJobItem"."status" IS 'The status of the import job item';
COMMENT ON COLUMN "import"."ImportJobItem"."audioPath" IS 'Staged audio file path for later promotion';
COMMENT ON COLUMN "import"."ImportJobItem"."artworkPath" IS 'Staged artwork file path for later promotion';
COMMENT ON COLUMN "import"."ImportJobItem"."errorMessage" IS 'The error message when importing failed';
COMMENT ON COLUMN "import"."ImportJobItem"."startedAt" IS 'The timestamp when importing started';
COMMENT ON COLUMN "import"."ImportJobItem"."completedAt" IS 'The timestamp when importing completed';
