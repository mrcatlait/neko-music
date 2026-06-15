CREATE TABLE "import"."MetadataClaim" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "importJobItemId" UUID NOT NULL,
  "field" VARCHAR(64) NOT NULL,
  "value" TEXT NOT NULL,
  "sourceAttribute" VARCHAR(255) NOT NULL,
  "extractor" VARCHAR(128) NOT NULL,
  "confidence" SMALLINT NOT NULL,
  CONSTRAINT "FK_MetadataClaim_ImportJobItem" FOREIGN KEY ("importJobItemId") REFERENCES "import"."ImportJobItem" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_MetadataClaim_Confidence" CHECK ("confidence" IN (1, 2, 3))
);

CREATE INDEX "IDX_MetadataClaim_ImportJobItemId" ON "import"."MetadataClaim" ("importJobItemId");
CREATE INDEX "IDX_MetadataClaim_Field" ON "import"."MetadataClaim" ("field");

COMMENT ON TABLE "import"."MetadataClaim" IS 'A metadata claim extracted from a source item';
COMMENT ON COLUMN "import"."MetadataClaim"."id" IS 'The ID of the metadata claim';
COMMENT ON COLUMN "import"."MetadataClaim"."importJobItemId" IS 'Foreign key to the import job item';
COMMENT ON COLUMN "import"."MetadataClaim"."field" IS 'The metadata field that was claimed';
COMMENT ON COLUMN "import"."MetadataClaim"."value" IS 'The claimed metadata value';
COMMENT ON COLUMN "import"."MetadataClaim"."sourceAttribute" IS 'The source attribute used to extract the value';
COMMENT ON COLUMN "import"."MetadataClaim"."extractor" IS 'The extractor that produced the claim';
COMMENT ON COLUMN "import"."MetadataClaim"."confidence" IS 'The confidence score (1=low, 2=medium, 3=high)';
