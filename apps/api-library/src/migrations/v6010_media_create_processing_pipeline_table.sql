CREATE TABLE "media"."ProcessingPipeline" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sourceId" UUID NOT NULL,
  "status" "media"."ProcessingStatus" NOT NULL DEFAULT 'PENDING',
  "startedAt" TIMESTAMP WITH TIME ZONE,
  "completedAt" TIMESTAMP WITH TIME ZONE,
  CONSTRAINT "FK_ProcessingPipeline_MediaSource" FOREIGN KEY ("sourceId") REFERENCES "media"."MediaSource" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "media"."ProcessingPipeline" IS 'A processing pipeline';
COMMENT ON COLUMN "media"."ProcessingPipeline"."id" IS 'The ID of the processing pipeline';
COMMENT ON COLUMN "media"."ProcessingPipeline"."sourceId" IS 'Foreign key to the media source';
COMMENT ON COLUMN "media"."ProcessingPipeline"."status" IS 'The status of the processing pipeline';
COMMENT ON COLUMN "media"."ProcessingPipeline"."startedAt" IS 'The date and time the processing pipeline started';
COMMENT ON COLUMN "media"."ProcessingPipeline"."completedAt" IS 'The date and time the processing pipeline completed';
