CREATE TABLE "media"."Image" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "quality" "media"."ImageQuality" NOT NULL,
  "format" VARCHAR(20) NOT NULL,
  "file_size" BIGINT NOT NULL,
  "dominant_color" VARCHAR(20),
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
