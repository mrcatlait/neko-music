CREATE TABLE "catalog"."AlbumArtwork" (
  "albumId" UUID NOT NULL,
  "mediaAssetId" UUID NOT NULL,
  "url" VARCHAR(255) NOT NULL DEFAULT '',
  "height" SMALLINT NOT NULL DEFAULT 0,
  "width" SMALLINT NOT NULL DEFAULT 0,
  "dominantColor" VARCHAR(255) NOT NULL DEFAULT '',
  PRIMARY KEY ("albumId", "mediaAssetId"),
  CONSTRAINT "FK_AlbumArtwork_Album" FOREIGN KEY ("albumId") REFERENCES "catalog"."Album" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_AlbumArtwork_Dimensions" CHECK ("height" > 0 AND "width" > 0)
  -- CONSTRAINT "FK_AlbumArtwork_MediaAsset" FOREIGN KEY ("mediaAssetId") REFERENCES "media"."MediaAsset" ("id")
);

COMMENT ON TABLE "catalog"."AlbumArtwork" IS 'A relationship between an album and an artwork';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."albumId" IS 'Foreign key to the album';
-- COMMENT ON COLUMN "catalog"."AlbumArtwork"."mediaAssetId" IS 'Foreign key to the media asset';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."url" IS 'The URL of the artwork';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."height" IS 'The height of the artwork';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."width" IS 'The width of the artwork';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."dominantColor" IS 'The dominant color of the artwork';
