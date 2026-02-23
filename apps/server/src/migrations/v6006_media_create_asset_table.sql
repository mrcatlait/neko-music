CREATE TABLE "media"."Asset" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sourceAssetId" UUID NOT NULL,
  "mediaType" "media"."MediaType" NOT NULL,
  "entityType" "media"."EntityType" NOT NULL,
  "entityId" UUID NOT NULL,
  "storageProvider" "media"."StorageProvider" NOT NULL,
  "storagePath" VARCHAR(255) NOT NULL,
  "fileSize" BIGINT NOT NULL,
  "format" VARCHAR(20) NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_Asset_SourceAsset" FOREIGN KEY ("sourceAssetId") REFERENCES "media"."SourceAsset" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "media"."Asset" IS 'A processed media asset';

COMMENT ON COLUMN "media"."Asset"."id" IS 'The ID of the media asset';
COMMENT ON COLUMN "media"."Asset"."sourceAssetId" IS 'Foreign key to the source media asset';
COMMENT ON COLUMN "media"."Asset"."mediaType" IS 'The type of media';
COMMENT ON COLUMN "media"."Asset"."entityType" IS 'The type of entity';
COMMENT ON COLUMN "media"."Asset"."entityId" IS 'The ID of the entity';
COMMENT ON COLUMN "media"."Asset"."storageProvider" IS 'The storage provider of the media asset';
COMMENT ON COLUMN "media"."Asset"."storagePath" IS 'The storage path of the media asset';
COMMENT ON COLUMN "media"."Asset"."fileSize" IS 'The file size of the media asset';
COMMENT ON COLUMN "media"."Asset"."format" IS 'The format of the media asset';
COMMENT ON COLUMN "media"."Asset"."createdAt" IS 'The date and time the media asset was created';
