CREATE TABLE "catalog"."ArtistArtwork" (
  "artistId" UUID NOT NULL,
  "mediaAssetId" UUID NOT NULL,
  "role" "catalog"."ArtworkRole" NOT NULL,
  "publicUrl" VARCHAR(255) NOT NULL DEFAULT '',
  "dominantColor" VARCHAR(255) NOT NULL DEFAULT '',
  PRIMARY KEY ("artistId", "mediaAssetId"),
  CONSTRAINT "FK_ArtistArtwork_Artist" FOREIGN KEY ("artistId") REFERENCES "catalog"."Artist" ("id") ON DELETE CASCADE
  -- CONSTRAINT "FK_ArtistArtwork_MediaAsset" FOREIGN KEY ("mediaAssetId") REFERENCES "media"."MediaAsset" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "catalog"."ArtistArtwork" IS 'A relationship between an artist and an artwork';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."artistId" IS 'Foreign key to the artist';
-- COMMENT ON COLUMN "catalog"."ArtistArtwork"."mediaAssetId" IS 'Foreign key to the media asset';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."role" IS 'The role of the artwork';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."publicUrl" IS 'The public URL of the artwork';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."dominantColor" IS 'The dominant color of the artwork';
