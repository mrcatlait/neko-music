CREATE TABLE "import"."ImportDiscovery" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "dataSource" VARCHAR(64) NOT NULL,
  "sourceRef" TEXT NOT NULL,
  "label" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" UUID NOT NULL
);

CREATE INDEX "IDX_ImportDiscovery_CreatedAt" ON "import"."ImportDiscovery" ("createdAt");

COMMENT ON TABLE "import"."ImportDiscovery" IS 'An immutable snapshot of discovered source items';
COMMENT ON COLUMN "import"."ImportDiscovery"."id" IS 'The ID of the import discovery';
COMMENT ON COLUMN "import"."ImportDiscovery"."dataSource" IS 'The import method key used for discovery';
COMMENT ON COLUMN "import"."ImportDiscovery"."sourceRef" IS 'The source reference used during discovery';
COMMENT ON COLUMN "import"."ImportDiscovery"."label" IS 'The label resolved from discovered source';
COMMENT ON COLUMN "import"."ImportDiscovery"."createdAt" IS 'The timestamp when discovery was created';
COMMENT ON COLUMN "import"."ImportDiscovery"."createdBy" IS 'The user who created the discovery';
