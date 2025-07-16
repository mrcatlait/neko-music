CREATE TABLE "media"."MediaFile" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "entity_type" "media"."EntityType" NOT NULL,
  "entity_id" UUID NOT NULL,
  "media_type" "media"."MediaType" NOT NULL,
  "metadata" JSONB, -- High-level metadata (e.g., dominant colors, overall dimensions)
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
