CREATE TABLE "analytics"."TrackAnalytics" (
  "trackId" UUID PRIMARY KEY,
  "playCount" BIGINT DEFAULT 0,
  "skipCount" BIGINT DEFAULT 0,
  "favoriteCount" BIGINT DEFAULT 0,
  "shareCount" BIGINT DEFAULT 0,
  "avgListenDuration" INTEGER DEFAULT 0,
  "completionRate" DECIMAL(5,2) DEFAULT 0,
  "dailyPlays" JSONB DEFAULT '{}'::JSONB,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_TrackAnalytics_Track" FOREIGN KEY ("trackId") REFERENCES "catalog"."Track" ("id")
);

COMMENT ON TABLE "analytics"."TrackAnalytics" IS 'A table to store track analytics data';
COMMENT ON COLUMN "analytics"."TrackAnalytics"."trackId" IS 'The ID of the track';
COMMENT ON COLUMN "analytics"."TrackAnalytics"."playCount" IS 'The number of plays of the track';
COMMENT ON COLUMN "analytics"."TrackAnalytics"."skipCount" IS 'The number of skips of the track';
COMMENT ON COLUMN "analytics"."TrackAnalytics"."favoriteCount" IS 'The number of favorites of the track';
COMMENT ON COLUMN "analytics"."TrackAnalytics"."shareCount" IS 'The number of shares of the track';
COMMENT ON COLUMN "analytics"."TrackAnalytics"."avgListenDuration" IS 'The average listen duration of the track';
COMMENT ON COLUMN "analytics"."TrackAnalytics"."completionRate" IS 'The completion rate of the track';
COMMENT ON COLUMN "analytics"."TrackAnalytics"."dailyPlays" IS 'The daily plays of the track';
COMMENT ON COLUMN "analytics"."TrackAnalytics"."updatedAt" IS 'The date and time the analytics were updated';
