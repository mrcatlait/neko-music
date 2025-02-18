CREATE TABLE "analytics"."ArtistPopularity" (
  "artist_id" UUID NOT NULL,
  "score" SMALLINT NOT NULL CHECK (score >= 0 AND score <= 100),
  "monthly_listeners" INTEGER,
  "stream_count" BIGINT,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("artist_id"),
  CONSTRAINT "FK_ArtistPopularity_Artist" FOREIGN KEY ("artist_id") REFERENCES "music"."Artist" ("id")
);
