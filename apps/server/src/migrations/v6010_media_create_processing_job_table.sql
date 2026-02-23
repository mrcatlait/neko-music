CREATE TABLE "media"."ProcessingJob" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sourceAssetId" UUID NOT NULL,
  "status" "media"."ProcessingStatus" NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "startedAt" TIMESTAMP NULL,
  "completedAt" TIMESTAMP NULL
);

COMMENT ON TABLE "media"."ProcessingJob" IS 'A media processing job';
COMMENT ON COLUMN "media"."ProcessingJob"."id" IS 'The ID of the media processing job';
COMMENT ON COLUMN "media"."ProcessingJob"."sourceAssetId" IS 'Foreign key to the source media asset';
COMMENT ON COLUMN "media"."ProcessingJob"."status" IS 'The status of the media processing job';
COMMENT ON COLUMN "media"."ProcessingJob"."createdAt" IS 'The date and time the media processing job was created';
COMMENT ON COLUMN "media"."ProcessingJob"."startedAt" IS 'The date and time the media processing job started';
COMMENT ON COLUMN "media"."ProcessingJob"."completedAt" IS 'The date and time the media processing job completed';
