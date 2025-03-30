CREATE TABLE "media"."AudioProcessing" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "audio_id" UUID NOT NULL,
  "status" "media"."ProcessingStatus" NOT NULL,
  "attempts" SMALLINT NOT NULL DEFAULT 0,
  "error_message" TEXT,
  "last_attempt_at" TIMESTAMP WITH TIME ZONE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_AudioProcessing_Audio" FOREIGN KEY ("audio_id") REFERENCES "media"."Audio" ("id") ON DELETE CASCADE
);
