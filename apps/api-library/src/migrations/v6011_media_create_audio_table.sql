CREATE TABLE "media"."Audio" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "track_id" UUID NOT NULL,
  "processing_status" "media"."ProcessingStatus" NOT NULL DEFAULT 'PENDING',
  "processing_attempts" SMALLINT NOT NULL DEFAULT 0,
  "processing_error" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
