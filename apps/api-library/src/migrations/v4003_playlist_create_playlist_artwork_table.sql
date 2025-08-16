CREATE TABLE "playlist"."PlaylistArtwork" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "playlistId" UUID NOT NULL,
  "mediaAssetId" UUID NOT NULL,
  "url" VARCHAR(255) NOT NULL DEFAULT '',
  "height" SMALLINT NOT NULL DEFAULT 0,
  "width" SMALLINT NOT NULL DEFAULT 0,
  "dominantColor" VARCHAR(255) NOT NULL DEFAULT '',
  CONSTRAINT "FK_PlaylistArtwork_Playlist" FOREIGN KEY ("playlistId") REFERENCES "playlist"."Playlist" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_PlaylistArtwork_Dimensions" CHECK ("height" > 0 AND "width" > 0)
  -- CONSTRAINT "FK_PlaylistArtwork_MediaAsset" FOREIGN KEY ("mediaAssetId") REFERENCES "media"."MediaAsset" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "playlist"."PlaylistArtwork" IS 'A relationship between a playlist and an artwork';
COMMENT ON COLUMN "playlist"."PlaylistArtwork"."id" IS 'The ID of the artwork';
COMMENT ON COLUMN "playlist"."PlaylistArtwork"."playlistId" IS 'Foreign key to the playlist';
-- COMMENT ON COLUMN "playlist"."PlaylistArtwork"."mediaAssetId" IS 'Foreign key to the media asset';
COMMENT ON COLUMN "playlist"."PlaylistArtwork"."url" IS 'The URL of the artwork';
COMMENT ON COLUMN "playlist"."PlaylistArtwork"."height" IS 'The height of the artwork';
COMMENT ON COLUMN "playlist"."PlaylistArtwork"."width" IS 'The width of the artwork';
COMMENT ON COLUMN "playlist"."PlaylistArtwork"."dominantColor" IS 'The dominant color of the artwork';
