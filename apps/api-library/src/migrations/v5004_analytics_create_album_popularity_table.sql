CREATE TABLE "analytics"."AlbumAnalytics" (
  "album_id" UUID PRIMARY KEY,
  "play_count" BIGINT DEFAULT 0,
  "favorite_count" BIGINT DEFAULT 0,
  "avg_rating" DECIMAL(3,2) DEFAULT 0,
  "rating_count" INTEGER DEFAULT 0,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_AlbumAnalytics_Album" FOREIGN KEY ("album_id") REFERENCES "music"."Album" ("id")
);
