CREATE TABLE "media"."MediaAudioMetadata" (
  "assetId" UUID NOT NULL,
  "bitrate" VARCHAR(255) NOT NULL,
  "sampleRate" INTEGER NOT NULL,
  "channels" SMALLINT NOT NULL,
  "codec" VARCHAR(255) NOT NULL,
  "duration" SMALLINT NOT NULL,
  CONSTRAINT "FK_MediaAudioMetadata_MediaAsset" FOREIGN KEY ("assetId") REFERENCES "media"."MediaAsset" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_MediaAudioMetadata_Duration" CHECK (duration > 0)
);

COMMENT ON TABLE "media"."MediaAudioMetadata" IS 'A media audio metadata';
COMMENT ON COLUMN "media"."MediaAudioMetadata"."assetId" IS 'Foreign key to the media asset';
COMMENT ON COLUMN "media"."MediaAudioMetadata"."bitrate" IS 'The bitrate of the media audio';
COMMENT ON COLUMN "media"."MediaAudioMetadata"."sampleRate" IS 'The sample rate of the media audio';
COMMENT ON COLUMN "media"."MediaAudioMetadata"."channels" IS 'The channels of the media audio';
COMMENT ON COLUMN "media"."MediaAudioMetadata"."codec" IS 'The codec of the media audio';
COMMENT ON COLUMN "media"."MediaAudioMetadata"."duration" IS 'The duration of the media audio';
