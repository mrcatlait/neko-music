CREATE TABLE "media"."ProcessingJobItem" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "jobId" UUID NOT NULL,
  -- TODO: Add enum for processing step
  "name" CHARACTER VARYING(255) NOT NULL,
  "order" SMALLINT NOT NULL,
  "status" "media"."ProcessingStatus" NOT NULL,
  "startedAt" TIMESTAMP NULL,
  "completedAt" TIMESTAMP NULL,
  "errorMessage" VARCHAR(255) NULL
);

COMMENT ON TABLE "media"."ProcessingJobItem" IS 'A media processing job item';
COMMENT ON COLUMN "media"."ProcessingJobItem"."id" IS 'The ID of the media processing job item';
COMMENT ON COLUMN "media"."ProcessingJobItem"."jobId" IS 'Foreign key to the media processing job';
COMMENT ON COLUMN "media"."ProcessingJobItem"."name" IS 'The name of the media processing job item';
COMMENT ON COLUMN "media"."ProcessingJobItem"."order" IS 'The order of the media processing job item';
COMMENT ON COLUMN "media"."ProcessingJobItem"."status" IS 'The status of the media processing job item';
COMMENT ON COLUMN "media"."ProcessingJobItem"."startedAt" IS 'The date and time the media processing job item started';
COMMENT ON COLUMN "media"."ProcessingJobItem"."completedAt" IS 'The date and time the media processing job item completed';
COMMENT ON COLUMN "media"."ProcessingJobItem"."errorMessage" IS 'The error message of the media processing job item';
