CREATE TABLE "media"."MediaFileVariant" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "media_file_id" UUID NOT NULL,
  "format" VARCHAR(20) NOT NULL,
  "storage_provider" "media"."StorageProvider" NOT NULL,
  "storage_path" VARCHAR(255) NOT NULL,
  "public_url" VARCHAR(255),
  "quality" "media"."MediaQuality" NOT NULL,
  "file_size" BIGINT NOT NULL,
  "file_hash" VARCHAR(64),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_MediaFileVariant_MediaFile" FOREIGN KEY ("media_file_id") REFERENCES "media"."MediaFile" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_MediaFileVariant_MediaFile_Format_Quality" UNIQUE ("media_file_id", "format", "quality"),
  CONSTRAINT "CHK_MediaFileVariant_FileSize" CHECK (file_size > 0)
);
