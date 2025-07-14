CREATE TABLE "music"."Album" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL UNIQUE,
  "release_date" DATE NOT NULL,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  "type" "music"."AlbumType" NOT NULL DEFAULT 'ALBUM',
  "artwork" JSONB NOT NULL DEFAULT '{
    "url": null,
    "background_color": null,
    "text_color": null
  }'::JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
