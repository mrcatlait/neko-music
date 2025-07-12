CREATE TABLE "media"."AudioStorage" (
  "audio_id" UUID NOT NULL,
  "storage_provider" "media"."StorageProvider" NOT NULL,
  "storage_path" VARCHAR(255) NOT NULL,
  "public_url" VARCHAR(255),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_AudioStorage_Audio" FOREIGN KEY ("audio_id") REFERENCES "media"."Audio" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_AudioStorage_AudioStorage" UNIQUE ("audio_id", "storage_provider")
);
