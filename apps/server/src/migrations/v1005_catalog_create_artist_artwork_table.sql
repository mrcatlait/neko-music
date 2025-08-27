CREATE TABLE "catalog"."ArtistArtwork" (
  "artistId" UUID NOT NULL,
  "mediaAssetId" UUID NOT NULL,
  "url" VARCHAR(255) NOT NULL DEFAULT '',
  "height" SMALLINT NOT NULL DEFAULT 0,
  "width" SMALLINT NOT NULL DEFAULT 0,
  "dominantColor" VARCHAR(255) NOT NULL DEFAULT '',
  PRIMARY KEY ("artistId", "mediaAssetId"),
  CONSTRAINT "FK_ArtistArtwork_Artist" FOREIGN KEY ("artistId") REFERENCES "catalog"."Artist" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_ArtistArtwork_Dimensions" CHECK ("height" >= 0 AND "width" >= 0)
  -- CONSTRAINT "FK_ArtistArtwork_MediaAsset" FOREIGN KEY ("mediaAssetId") REFERENCES "media"."MediaAsset" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "catalog"."ArtistArtwork" IS 'A relationship between an artist and an artwork';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."artistId" IS 'Foreign key to the artist';
-- COMMENT ON COLUMN "catalog"."ArtistArtwork"."mediaAssetId" IS 'Foreign key to the media asset';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."url" IS 'The URL of the artwork';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."height" IS 'The height of the artwork';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."width" IS 'The width of the artwork';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."dominantColor" IS 'The dominant color of the artwork';
