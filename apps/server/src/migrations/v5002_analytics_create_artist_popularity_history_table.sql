CREATE TABLE "analytics"."ArtistPopularityHistory" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "artist_id" UUID NOT NULL,
  "score" SMALLINT NOT NULL CHECK (score >= 0 AND score <= 100),
  "monthly_listeners" INTEGER,
  "stream_count" BIGINT,
  "recorded_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_ArtistPopularityHistory_Artist" FOREIGN KEY ("artist_id") REFERENCES "music"."Artist" ("id")
);