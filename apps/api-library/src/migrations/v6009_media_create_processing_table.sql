CREATE TABLE "media"."ProcessingPipeline" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "media_file_id" UUID NOT NULL,
  "processing_status" "media"."ProcessingStatus" NOT NULL DEFAULT 'PENDING',
  "attempts" SMALLINT NOT NULL DEFAULT 0,
  "error_message" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_ProcessingPipeline_MediaFile" FOREIGN KEY ("media_file_id") REFERENCES "media"."MediaFile" ("id") ON DELETE CASCADE
);
