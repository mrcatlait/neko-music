CREATE TABLE "media"."ProcessingPipeline" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "assetId" UUID NOT NULL,
  "processingJob" VARCHAR(255) NOT NULL,
  "status" "media"."ProcessingStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" SMALLINT NOT NULL DEFAULT 0,
  "errorMessage" TEXT,
  "startedAt" TIMESTAMP WITH TIME ZONE,
  "completedAt" TIMESTAMP WITH TIME ZONE,
  CONSTRAINT "FK_ProcessingPipeline_MediaAsset" FOREIGN KEY ("assetId") REFERENCES "media"."MediaAsset" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_ProcessingPipeline_Attempts" CHECK ("attempts" >= 0)
);

COMMENT ON TABLE "media"."ProcessingPipeline" IS 'A processing pipeline';
COMMENT ON COLUMN "media"."ProcessingPipeline"."id" IS 'The ID of the processing pipeline';
COMMENT ON COLUMN "media"."ProcessingPipeline"."assetId" IS 'Foreign key to the media asset';
COMMENT ON COLUMN "media"."ProcessingPipeline"."processingJob" IS 'The processing job of the processing pipeline';
COMMENT ON COLUMN "media"."ProcessingPipeline"."status" IS 'The status of the processing pipeline';
COMMENT ON COLUMN "media"."ProcessingPipeline"."attempts" IS 'The number of attempts of the processing pipeline';
COMMENT ON COLUMN "media"."ProcessingPipeline"."errorMessage" IS 'The error message of the processing pipeline';
COMMENT ON COLUMN "media"."ProcessingPipeline"."startedAt" IS 'The date and time the processing pipeline started';
COMMENT ON COLUMN "media"."ProcessingPipeline"."completedAt" IS 'The date and time the processing pipeline completed';
