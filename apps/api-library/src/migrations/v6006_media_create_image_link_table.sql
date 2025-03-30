CREATE TABLE "media"."ImageLink" (
  "image_id" UUID NOT NULL,
  "entity_type" "media"."EntityType" NOT NULL,
  "entity_id" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_ImageLink_Image" FOREIGN KEY ("image_id") REFERENCES "media"."Image" ("id") ON DELETE CASCADE
);
