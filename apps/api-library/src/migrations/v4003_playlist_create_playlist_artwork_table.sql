CREATE TABLE "playlist"."PlaylistArtwork" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "playlistId" UUID NOT NULL,
  "mediaAssetId" UUID NOT NULL,
  CONSTRAINT "FK_PlaylistArtwork_Playlist" FOREIGN KEY ("playlistId") REFERENCES "playlist"."Playlist" ("id") ON DELETE CASCADE
  -- CONSTRAINT "FK_PlaylistArtwork_MediaAsset" FOREIGN KEY ("mediaAssetId") REFERENCES "media"."MediaAsset" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "playlist"."PlaylistArtwork" IS 'A relationship between a playlist and an artwork';
COMMENT ON COLUMN "playlist"."PlaylistArtwork"."id" IS 'The ID of the artwork';
COMMENT ON COLUMN "playlist"."PlaylistArtwork"."playlistId" IS 'Foreign key to the playlist';
-- COMMENT ON COLUMN "playlist"."PlaylistArtwork"."mediaAssetId" IS 'Foreign key to the media asset';
