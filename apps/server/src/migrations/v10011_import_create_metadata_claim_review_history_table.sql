CREATE TABLE "import"."MetadataClaimReviewHistory" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "metadataClaimReviewId" UUID NOT NULL,
  "decisionFrom" "import"."ClaimReviewDecision" NULL,
  "decisionTo" "import"."ClaimReviewDecision" NOT NULL,
  "replacementEntityIdFrom" UUID NULL,
  "replacementEntityIdTo" UUID NULL,
  "replacementValueFrom" TEXT NULL,
  "replacementValueTo" TEXT NULL,
  "reason" TEXT NULL,
  "changedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "changedBy" UUID NOT NULL,
  CONSTRAINT "FK_MetadataClaimReviewHistory_MetadataClaimReview"
    FOREIGN KEY ("metadataClaimReviewId") REFERENCES "import"."MetadataClaimReview" ("id") ON DELETE CASCADE
);

CREATE INDEX "IDX_MetadataClaimReviewHistory_ReviewId_ChangedAt"
  ON "import"."MetadataClaimReviewHistory" ("metadataClaimReviewId", "changedAt" DESC);

COMMENT ON TABLE "import"."MetadataClaimReviewHistory" IS 'Append-only history of metadata claim review decisions';
COMMENT ON COLUMN "import"."MetadataClaimReviewHistory"."id" IS 'The ID of the review history event';
COMMENT ON COLUMN "import"."MetadataClaimReviewHistory"."metadataClaimReviewId" IS 'Foreign key to metadata claim review';
COMMENT ON COLUMN "import"."MetadataClaimReviewHistory"."decisionFrom" IS 'Previous decision before change';
COMMENT ON COLUMN "import"."MetadataClaimReviewHistory"."decisionTo" IS 'New decision after change';
COMMENT ON COLUMN "import"."MetadataClaimReviewHistory"."replacementEntityIdFrom" IS 'Previous replacement entity';
COMMENT ON COLUMN "import"."MetadataClaimReviewHistory"."replacementEntityIdTo" IS 'New replacement entity';
COMMENT ON COLUMN "import"."MetadataClaimReviewHistory"."replacementValueFrom" IS 'Previous replacement value';
COMMENT ON COLUMN "import"."MetadataClaimReviewHistory"."replacementValueTo" IS 'New replacement value';
COMMENT ON COLUMN "import"."MetadataClaimReviewHistory"."reason" IS 'Optional reviewer reason for decision change';
COMMENT ON COLUMN "import"."MetadataClaimReviewHistory"."changedAt" IS 'Timestamp when change was persisted';
COMMENT ON COLUMN "import"."MetadataClaimReviewHistory"."changedBy" IS 'User that changed the review';
