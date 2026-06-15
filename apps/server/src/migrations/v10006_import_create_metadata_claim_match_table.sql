CREATE TABLE "import"."MetadataClaimMatch" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "metadataClaimId" UUID NOT NULL,
  "entityId" UUID NOT NULL,
  "entityType" "media"."EntityType" NOT NULL,
  "score" SMALLINT NOT NULL,
  CONSTRAINT "FK_MetadataClaimMatch_MetadataClaim" FOREIGN KEY ("metadataClaimId") REFERENCES "import"."MetadataClaim" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_MetadataClaimMatch_Score" CHECK ("score" IN (1, 2, 3))
);

CREATE INDEX "IDX_MetadataClaimMatch_MetadataClaimId" ON "import"."MetadataClaimMatch" ("metadataClaimId");
CREATE INDEX "IDX_MetadataClaimMatch_Entity" ON "import"."MetadataClaimMatch" ("entityType", "entityId");

COMMENT ON TABLE "import"."MetadataClaimMatch" IS 'A candidate match between a metadata claim and a catalog entity';
COMMENT ON COLUMN "import"."MetadataClaimMatch"."id" IS 'The ID of the metadata claim match';
COMMENT ON COLUMN "import"."MetadataClaimMatch"."metadataClaimId" IS 'Foreign key to the metadata claim';
COMMENT ON COLUMN "import"."MetadataClaimMatch"."entityId" IS 'The ID of the matched entity';
COMMENT ON COLUMN "import"."MetadataClaimMatch"."entityType" IS 'The type of the matched entity';
COMMENT ON COLUMN "import"."MetadataClaimMatch"."score" IS 'The match score (1=low, 2=medium, 3=high)';
