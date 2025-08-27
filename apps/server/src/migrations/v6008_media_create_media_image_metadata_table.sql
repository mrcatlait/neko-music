CREATE TABLE "media"."MediaImageMetadata" (
  "assetId" UUID NOT NULL,
  "width" SMALLINT NOT NULL,
  "height" SMALLINT NOT NULL,
  "dominantColor" VARCHAR(7) NOT NULL DEFAULT '#000000',
  CONSTRAINT "FK_MediaImageMetadata_MediaAsset" FOREIGN KEY ("assetId") REFERENCES "media"."MediaAsset" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_MediaImageMetadata_DominantColor" CHECK ("dominantColor" ~ '^#[0-9A-Fa-f]{6}$')
);

COMMENT ON TABLE "media"."MediaImageMetadata" IS 'A media image metadata';
COMMENT ON COLUMN "media"."MediaImageMetadata"."assetId" IS 'Foreign key to the media asset';
COMMENT ON COLUMN "media"."MediaImageMetadata"."width" IS 'The width of the media image';
COMMENT ON COLUMN "media"."MediaImageMetadata"."height" IS 'The height of the media image';
COMMENT ON COLUMN "media"."MediaImageMetadata"."dominantColor" IS 'The dominant color of the media image';
