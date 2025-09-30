CREATE TABLE "media"."ImageMetadata" (
  "assetId" UUID NOT NULL,
  "width" SMALLINT NOT NULL,
  "height" SMALLINT NOT NULL,
  "dominantColor" VARCHAR(7) NOT NULL DEFAULT '#000000',
  CONSTRAINT "FK_MediaImageMetadata_MediaAsset" FOREIGN KEY ("assetId") REFERENCES "media"."Asset" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_MediaImageMetadata_DominantColor" CHECK ("dominantColor" ~ '^#[0-9A-Fa-f]{6}$')
);

COMMENT ON TABLE "media"."ImageMetadata" IS 'A media image metadata';
COMMENT ON COLUMN "media"."ImageMetadata"."assetId" IS 'Foreign key to the media asset';
COMMENT ON COLUMN "media"."ImageMetadata"."width" IS 'The width of the media image';
COMMENT ON COLUMN "media"."ImageMetadata"."height" IS 'The height of the media image';
COMMENT ON COLUMN "media"."ImageMetadata"."dominantColor" IS 'The dominant color of the media image';
