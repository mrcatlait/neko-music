CREATE TABLE "music"."Album" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL UNIQUE,
  "release_date" DATE NOT NULL,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  "type" "music"."AlbumType" NOT NULL DEFAULT 'ALBUM',
  -- "primary_artist_id" UUID NOT NULL,
  "artwork" JSONB NOT NULL DEFAULT '{
    "url": null,
    "background_color": null,
    "text_color": null
  }'::JSONB,
  "metadata" JSONB NOT NULL DEFAULT '{
    "editorial_notes": {
      "short": null,
      "standard": null
    }
  }'::JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
