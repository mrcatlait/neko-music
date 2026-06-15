CREATE TABLE "import"."MetadataClaimReview" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "metadataClaimId" UUID NOT NULL,
  "decision" "import"."ClaimReviewDecision" NOT NULL DEFAULT 'pending',
  "replacementEntityId" UUID NULL,
  "replacementValue" TEXT NULL,
  "reviewedAt" TIMESTAMP NULL,
  "reviewedBy" UUID NULL,
  CONSTRAINT "FK_MetadataClaimReview_MetadataClaim" FOREIGN KEY ("metadataClaimId") REFERENCES "import"."MetadataClaim" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_MetadataClaimReview_MetadataClaimId" UNIQUE ("metadataClaimId")
);

COMMENT ON TABLE "import"."MetadataClaimReview" IS 'The review decision for a metadata claim';
COMMENT ON COLUMN "import"."MetadataClaimReview"."id" IS 'The ID of the metadata claim review';
COMMENT ON COLUMN "import"."MetadataClaimReview"."metadataClaimId" IS 'Foreign key to the metadata claim';
COMMENT ON COLUMN "import"."MetadataClaimReview"."decision" IS 'The review decision';
COMMENT ON COLUMN "import"."MetadataClaimReview"."replacementEntityId" IS 'Existing entity selected as replacement resolution';
COMMENT ON COLUMN "import"."MetadataClaimReview"."replacementValue" IS 'Manual replacement value for create_new resolution';
COMMENT ON COLUMN "import"."MetadataClaimReview"."reviewedAt" IS 'The timestamp when the claim was reviewed';
COMMENT ON COLUMN "import"."MetadataClaimReview"."reviewedBy" IS 'The user who reviewed the claim';
