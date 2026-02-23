CREATE TABLE "media"."ProcessingStep" (
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

COMMENT ON TABLE "media"."ProcessingStep" IS 'A media processing step';
COMMENT ON COLUMN "media"."ProcessingStep"."id" IS 'The ID of the media processing step';
COMMENT ON COLUMN "media"."ProcessingStep"."jobId" IS 'Foreign key to the media processing job';
COMMENT ON COLUMN "media"."ProcessingStep"."name" IS 'The name of the media processing step';
COMMENT ON COLUMN "media"."ProcessingStep"."order" IS 'The order of the media processing step';
COMMENT ON COLUMN "media"."ProcessingStep"."status" IS 'The status of the media processing step';
COMMENT ON COLUMN "media"."ProcessingStep"."startedAt" IS 'The date and time the media processing step started';
COMMENT ON COLUMN "media"."ProcessingStep"."completedAt" IS 'The date and time the media processing step completed';
COMMENT ON COLUMN "media"."ProcessingStep"."errorMessage" IS 'The error message of the media processing step';
