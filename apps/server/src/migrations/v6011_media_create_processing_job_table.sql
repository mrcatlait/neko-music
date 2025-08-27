CREATE TABLE "media"."ProcessingJob" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "pipelineId" UUID NOT NULL,
  "jobName" VARCHAR(100) NOT NULL,
  "jobOrder" SMALLINT NOT NULL,
  "status" "media"."ProcessingStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" SMALLINT NOT NULL DEFAULT 0,
  "errorMessage" TEXT,
  "startedAt" TIMESTAMP WITH TIME ZONE,
  "completedAt" TIMESTAMP WITH TIME ZONE,
  CONSTRAINT "FK_ProcessingJob_ProcessingPipeline" FOREIGN KEY ("pipelineId") REFERENCES "media"."ProcessingPipeline" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_ProcessingJob_Attempts" CHECK ("attempts" >= 0)
);

COMMENT ON TABLE "media"."ProcessingJob" IS 'A processing job';
COMMENT ON COLUMN "media"."ProcessingJob"."id" IS 'The ID of the processing job';
COMMENT ON COLUMN "media"."ProcessingJob"."pipelineId" IS 'Foreign key to the processing pipeline';
COMMENT ON COLUMN "media"."ProcessingJob"."jobName" IS 'The name of the processing job';
COMMENT ON COLUMN "media"."ProcessingJob"."jobOrder" IS 'The order of the processing job';
COMMENT ON COLUMN "media"."ProcessingJob"."status" IS 'The status of the processing job';
COMMENT ON COLUMN "media"."ProcessingJob"."attempts" IS 'The number of attempts of the processing job';
COMMENT ON COLUMN "media"."ProcessingJob"."errorMessage" IS 'The error message of the processing job';
COMMENT ON COLUMN "media"."ProcessingJob"."startedAt" IS 'The date and time the processing job started';
COMMENT ON COLUMN "media"."ProcessingJob"."completedAt" IS 'The date and time the processing job completed';
