CREATE TABLE "music"."Album" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "release_date" DATE NOT NULL,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  "type" "music"."AlbumType" NOT NULL DEFAULT 'ALBUM',
  "artwork" JSONB NOT NULL DEFAULT '{
    "url": null,
    "backgroundColor": null,
    "textColor": null
  }'::JSONB,
  "artwork_id" UUID,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
