ALTER TABLE "import"."ImportJobItem"
  ADD COLUMN "retryCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastRetriedAt" TIMESTAMP NULL,
  ADD COLUMN "lastRetriedBy" UUID NULL;

CREATE TABLE "import"."ImportJobItemRetryHistory" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "importJobItemId" UUID NOT NULL,
  "attemptNumber" INTEGER NOT NULL,
  "reason" TEXT NULL,
  "errorMessage" VARCHAR(255) NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "createdBy" UUID NOT NULL,
  CONSTRAINT "FK_ImportJobItemRetryHistory_ImportJobItem"
    FOREIGN KEY ("importJobItemId") REFERENCES "import"."ImportJobItem" ("id") ON DELETE CASCADE
);

CREATE INDEX "IDX_ImportJobItemRetryHistory_ItemId_CreatedAt"
  ON "import"."ImportJobItemRetryHistory" ("importJobItemId", "createdAt" DESC);

COMMENT ON COLUMN "import"."ImportJobItem"."retryCount" IS 'How many manual retries were requested for this item';
COMMENT ON COLUMN "import"."ImportJobItem"."lastRetriedAt" IS 'Timestamp of the latest retry request';
COMMENT ON COLUMN "import"."ImportJobItem"."lastRetriedBy" IS 'User that requested latest retry';
COMMENT ON TABLE "import"."ImportJobItemRetryHistory" IS 'Append-only retry history for failed import items';
