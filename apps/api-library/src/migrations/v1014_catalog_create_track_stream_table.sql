CREATE TABLE "catalog"."TrackStream" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "trackId" UUID NOT NULL,
  "mediaAssetId" UUID NOT NULL,
  CONSTRAINT "FK_TrackStream_Track" FOREIGN KEY ("trackId") REFERENCES "catalog"."Track" ("id") ON DELETE CASCADE
  -- CONSTRAINT "FK_TrackStream_MediaAsset" FOREIGN KEY ("mediaAssetId") REFERENCES "media"."MediaAsset" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "catalog"."TrackStream" IS 'A stream of a track';
COMMENT ON COLUMN "catalog"."TrackStream"."trackId" IS 'Foreign key to the track';
-- COMMENT ON COLUMN "catalog"."TrackStream"."mediaAssetId" IS 'Foreign key to the media asset';
