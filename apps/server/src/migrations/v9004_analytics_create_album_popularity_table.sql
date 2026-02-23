CREATE TABLE "analytics"."AlbumAnalytics" (
  "albumId" UUID PRIMARY KEY,
  "playCount" BIGINT DEFAULT 0,
  "favoriteCount" BIGINT DEFAULT 0,
  "avgRating" DECIMAL(3,2) DEFAULT 0,
  "ratingCount" INTEGER DEFAULT 0,
  "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_AlbumAnalytics_Album" FOREIGN KEY ("albumId") REFERENCES "catalog"."Album" ("id")
);

COMMENT ON TABLE "analytics"."AlbumAnalytics" IS 'A table to store album analytics data';
COMMENT ON COLUMN "analytics"."AlbumAnalytics"."albumId" IS 'The ID of the album';
COMMENT ON COLUMN "analytics"."AlbumAnalytics"."playCount" IS 'The number of plays of the album';
COMMENT ON COLUMN "analytics"."AlbumAnalytics"."favoriteCount" IS 'The number of favorites of the album';
COMMENT ON COLUMN "analytics"."AlbumAnalytics"."avgRating" IS 'The average rating of the album';
COMMENT ON COLUMN "analytics"."AlbumAnalytics"."ratingCount" IS 'The number of ratings of the album';
COMMENT ON COLUMN "analytics"."AlbumAnalytics"."updatedAt" IS 'The date and time the analytics were updated';
