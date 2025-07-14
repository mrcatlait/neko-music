CREATE TABLE "analytics"."TrackAnalytics" (
  "track_id" UUID PRIMARY KEY,
  "play_count" BIGINT DEFAULT 0,
  "skip_count" BIGINT DEFAULT 0,
  "favorite_count" BIGINT DEFAULT 0,
  "share_count" BIGINT DEFAULT 0,
  "avg_listen_duration" INTEGER DEFAULT 0,
  "completion_rate" DECIMAL(5,2) DEFAULT 0,
  "daily_plays" JSONB DEFAULT '{}'::JSONB,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_TrackAnalytics_Track" FOREIGN KEY ("track_id") REFERENCES "music"."Track" ("id")
);
