CREATE TABLE "catalog"."AlbumArtwork" (
  "albumId" UUID NOT NULL,
  "mediaAssetId" UUID NOT NULL,
  "role" "catalog"."ArtworkRole" NOT NULL,
  "publicUrl" VARCHAR(255) NOT NULL DEFAULT '',
  "dominantColor" VARCHAR(255) NOT NULL DEFAULT '',
  PRIMARY KEY ("albumId", "mediaAssetId"),
  CONSTRAINT "FK_AlbumArtwork_Album" FOREIGN KEY ("albumId") REFERENCES "catalog"."Album" ("id") ON DELETE CASCADE,
  -- CONSTRAINT "FK_AlbumArtwork_MediaAsset" FOREIGN KEY ("mediaAssetId") REFERENCES "media"."MediaAsset" ("id")
);

COMMENT ON TABLE "catalog"."AlbumArtwork" IS 'A relationship between an album and an artwork';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."albumId" IS 'Foreign key to the album';
-- COMMENT ON COLUMN "catalog"."AlbumArtwork"."mediaAssetId" IS 'Foreign key to the media asset';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."role" IS 'The role of the artwork';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."publicUrl" IS 'The public URL of the artwork';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."dominantColor" IS 'The dominant color of the artwork';
