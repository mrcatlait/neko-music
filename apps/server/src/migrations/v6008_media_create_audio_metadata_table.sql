CREATE TABLE "media"."AudioMetadata" (
  "assetId" UUID NOT NULL,
  "bitrate" VARCHAR(255) NOT NULL,
  "sampleRate" INTEGER NOT NULL,
  "channels" SMALLINT NOT NULL,
  "codec" VARCHAR(255) NOT NULL,
  "duration" SMALLINT NOT NULL,
  CONSTRAINT "FK_AudioMetadata_MediaAsset" FOREIGN KEY ("assetId") REFERENCES "media"."Asset" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_AudioMetadata_Duration" CHECK (duration > 0)
);

COMMENT ON TABLE "media"."AudioMetadata" IS 'A media audio metadata';
COMMENT ON COLUMN "media"."AudioMetadata"."assetId" IS 'Foreign key to the media asset';
COMMENT ON COLUMN "media"."AudioMetadata"."bitrate" IS 'The bitrate of the media audio';
COMMENT ON COLUMN "media"."AudioMetadata"."sampleRate" IS 'The sample rate of the media audio';
COMMENT ON COLUMN "media"."AudioMetadata"."channels" IS 'The channels of the media audio';
COMMENT ON COLUMN "media"."AudioMetadata"."codec" IS 'The codec of the media audio';
COMMENT ON COLUMN "media"."AudioMetadata"."duration" IS 'The duration of the media audio';
