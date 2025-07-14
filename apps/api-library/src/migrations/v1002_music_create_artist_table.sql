CREATE TABLE "music"."Artist" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "verified" BOOLEAN NOT NULL DEFAULT FALSE,
  "artwork" JSONB NOT NULL DEFAULT '{
    "url": null,
    "background_color": null,
    "text_color": null
  }'::JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
