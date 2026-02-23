CREATE TABLE "media"."SourceAsset" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "mediaType" "media"."MediaType" NOT NULL,
  "entityType" "media"."EntityType" NOT NULL,
  "entityId" UUID NOT NULL,
  "format" VARCHAR(20) NOT NULL,
  "fileSize" BIGINT NOT NULL,
  "storageProvider" "media"."StorageProvider" NOT NULL,
  "storagePath" VARCHAR(255) NOT NULL,
  "checksum" VARCHAR(255) NOT NULL,
  "createdBy" UUID NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE "media"."SourceAsset" IS 'A source media asset';

COMMENT ON COLUMN "media"."SourceAsset"."id" IS 'The ID of the source media asset';
COMMENT ON COLUMN "media"."SourceAsset"."mediaType" IS 'The type of media';
COMMENT ON COLUMN "media"."SourceAsset"."entityType" IS 'The type of entity';
COMMENT ON COLUMN "media"."SourceAsset"."entityId" IS 'The ID of the entity';
COMMENT ON COLUMN "media"."SourceAsset"."format" IS 'The format of the source media asset';
COMMENT ON COLUMN "media"."SourceAsset"."fileSize" IS 'The file size of the source media asset';
COMMENT ON COLUMN "media"."SourceAsset"."storageProvider" IS 'The storage provider of the source media asset';
COMMENT ON COLUMN "media"."SourceAsset"."storagePath" IS 'The storage path of the source media asset';
COMMENT ON COLUMN "media"."SourceAsset"."checksum" IS 'The checksum of the source media asset';
COMMENT ON COLUMN "media"."SourceAsset"."createdBy" IS 'The ID of the user who created the source media asset';
COMMENT ON COLUMN "media"."SourceAsset"."createdAt" IS 'The date and time the source media asset was created';
