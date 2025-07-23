CREATE TABLE "media"."AudioVariant" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "audio_id" UUID NOT NULL,
  "format" VARCHAR(20) NOT NULL,
  "storage_provider" "media"."StorageProvider" NOT NULL,
  "storage_path" VARCHAR(255) NOT NULL,
  "public_url" VARCHAR(255),
  "quality" "media"."AudioQuality" NOT NULL,
  "bitrate" SMALLINT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_AudioVariant_Audio" FOREIGN KEY ("audio_id") REFERENCES "media"."Audio" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_AudioVariant_Audio_Format_Quality" UNIQUE ("audio_id", "format", "quality")
);
