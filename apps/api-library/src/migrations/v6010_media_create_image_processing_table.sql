CREATE TABLE "media"."ImageProcessing" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "image_id" UUID NOT NULL,
  "status" "media"."ProcessingStatus" NOT NULL,
  "attempts" SMALLINT NOT NULL DEFAULT 0,
  "error_message" TEXT,
  "last_attempt_at" TIMESTAMP WITH TIME ZONE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_ImageProcessing_Image" FOREIGN KEY ("image_id") REFERENCES "media"."Image" ("id") ON DELETE CASCADE
);
