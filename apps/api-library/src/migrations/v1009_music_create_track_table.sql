CREATE TABLE "music"."Track" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL UNIQUE,
  "album_id" UUID NOT NULL,
  "track_number" SMALLINT NOT NULL,
  "disk_number" SMALLINT NOT NULL,
  "release_date" DATE NOT NULL,
  "duration" SMALLINT NOT NULL,
  -- "primary_artist_id" UUID NOT NULL,
  "artwork" JSONB NOT NULL DEFAULT '{
    "url": null,
    "background_color": null,
    "text_color": null
  }'::JSONB,
  "streaming_info" JSONB,
  "has_lyrics" BOOLEAN NOT NULL DEFAULT FALSE,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_Track_Album" FOREIGN KEY ("album_id") REFERENCES "music"."Album" ("id")
);
