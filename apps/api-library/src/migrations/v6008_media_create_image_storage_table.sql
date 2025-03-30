CREATE TABLE "media"."ImageStorage" (
  "image_id" UUID NOT NULL,
  "storage_provider" "media"."StorageProvider" NOT NULL,
  "storage_path" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_ImageStorage_Image" FOREIGN KEY ("image_id") REFERENCES "media"."Image" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_ImageStorage_ImageStorage" UNIQUE ("image_id", "storage_provider")
);
