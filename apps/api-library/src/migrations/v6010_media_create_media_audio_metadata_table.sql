CREATE TABLE "media"."MediaAudioMetadata" (
  "assetId" UUID NOT NULL,
  "bitrate" SMALLINT NOT NULL,
  "duration" SMALLINT NOT NULL,
  CONSTRAINT "FK_MediaAudioMetadata_MediaAsset" FOREIGN KEY ("assetId") REFERENCES "media"."MediaAsset" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_MediaAudioMetadata_Bitrate" CHECK (bitrate > 0),
  CONSTRAINT "CHK_MediaAudioMetadata_Duration" CHECK (duration > 0)
);

COMMENT ON TABLE "media"."MediaAudioMetadata" IS 'A media audio metadata';
COMMENT ON COLUMN "media"."MediaAudioMetadata"."assetId" IS 'Foreign key to the media asset';
COMMENT ON COLUMN "media"."MediaAudioMetadata"."bitrate" IS 'The bitrate of the media audio';
COMMENT ON COLUMN "media"."MediaAudioMetadata"."duration" IS 'The duration of the media audio';
