CREATE TABLE "analytics"."ArtistPopularity" (
  "artistId" UUID NOT NULL,
  "score" SMALLINT NOT NULL CHECK (score >= 0 AND score <= 100),
  "monthlyListeners" INTEGER,
  "streamCount" BIGINT,
  PRIMARY KEY ("artistId"),
  CONSTRAINT "FK_ArtistPopularity_Artist" FOREIGN KEY ("artistId") REFERENCES "catalog"."Artist" ("id")
);

COMMENT ON TABLE "analytics"."ArtistPopularity" IS 'A table to store artist popularity data';
COMMENT ON COLUMN "analytics"."ArtistPopularity"."artistId" IS 'The ID of the artist';
COMMENT ON COLUMN "analytics"."ArtistPopularity"."score" IS 'The score of the artist';
COMMENT ON COLUMN "analytics"."ArtistPopularity"."monthlyListeners" IS 'The number of monthly listeners of the artist';
COMMENT ON COLUMN "analytics"."ArtistPopularity"."streamCount" IS 'The number of streams of the artist';
