CREATE TABLE "import"."ImportDiscoveryItem" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "discoveryId" UUID NOT NULL,
  "sourceItemRef" TEXT NOT NULL,
  "label" VARCHAR(255) NOT NULL,
  "position" INTEGER NOT NULL,
  "isSelected" BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT "FK_ImportDiscoveryItem_ImportDiscovery" FOREIGN KEY ("discoveryId") REFERENCES "import"."ImportDiscovery" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_ImportDiscoveryItem_DiscoveryId_SourceItemRef" UNIQUE ("discoveryId", "sourceItemRef")
);

CREATE INDEX "IDX_ImportDiscoveryItem_DiscoveryId_Position" ON "import"."ImportDiscoveryItem" ("discoveryId", "position");

COMMENT ON TABLE "import"."ImportDiscoveryItem" IS 'A discovered source item within an import discovery snapshot';
COMMENT ON COLUMN "import"."ImportDiscoveryItem"."id" IS 'The ID of the import discovery item';
COMMENT ON COLUMN "import"."ImportDiscoveryItem"."discoveryId" IS 'Foreign key to the import discovery';
COMMENT ON COLUMN "import"."ImportDiscoveryItem"."sourceItemRef" IS 'The reference to the discovered source item';
COMMENT ON COLUMN "import"."ImportDiscoveryItem"."label" IS 'The label of the discovered source item';
COMMENT ON COLUMN "import"."ImportDiscoveryItem"."position" IS 'The stable position of the discovered source item';
COMMENT ON COLUMN "import"."ImportDiscoveryItem"."isSelected" IS 'Whether the discovery item is selected for import';
