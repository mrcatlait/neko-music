CREATE TABLE "analytics"."ArtistPopularityHistory" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "artistId" UUID NOT NULL,
  "score" SMALLINT NOT NULL CHECK (score >= 0 AND score <= 100),
  "monthlyListeners" INTEGER,
  "streamCount" BIGINT,
  "recordedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_ArtistPopularityHistory_Artist" FOREIGN KEY ("artistId") REFERENCES "catalog"."Artist" ("id")
);

COMMENT ON TABLE "analytics"."ArtistPopularityHistory" IS 'A table to store artist popularity history data';
COMMENT ON COLUMN "analytics"."ArtistPopularityHistory"."id" IS 'The ID of the artist popularity history';
COMMENT ON COLUMN "analytics"."ArtistPopularityHistory"."artistId" IS 'The ID of the artist';
COMMENT ON COLUMN "analytics"."ArtistPopularityHistory"."score" IS 'The score of the artist';
COMMENT ON COLUMN "analytics"."ArtistPopularityHistory"."monthlyListeners" IS 'The number of monthly listeners of the artist';
COMMENT ON COLUMN "analytics"."ArtistPopularityHistory"."streamCount" IS 'The number of streams of the artist';
COMMENT ON COLUMN "analytics"."ArtistPopularityHistory"."recordedAt" IS 'The date and time the popularity was recorded';
