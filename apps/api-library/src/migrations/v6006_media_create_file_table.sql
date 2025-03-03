CREATE TABLE "media"."File" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "entity_type" "media"."EntityType" NOT NULL,
  "entity_id" UUID NOT NULL,
  "media_type" "media"."MediaType" NOT NULL,
  "storage_provider" "media"."StorageProvider" NOT NULL,
  "file_size" BIGINT NOT NULL,
  "storage_url" VARCHAR(255) NOT NULL,
  "original_filename" VARCHAR(255),
  "mime_type" VARCHAR(100) NOT NULL,
  "checksum" VARCHAR(64),                  -- For file integrity verification
  "metadata" JSONB NOT NULL DEFAULT '{}'::JSONB,
  "created_by" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UQ_Entity_MediaType_Quality" UNIQUE ("entity_id", "media_type", "quality")
);
