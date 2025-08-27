CREATE TABLE "media"."MediaSource" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "mediaType" "media"."MediaType" NOT NULL,
  "entityId" UUID NOT NULL,
  "entityType" "media"."EntityType" NOT NULL,
  "format" VARCHAR(20),
  "fileSize" BIGINT,
  "storageProvider" "media"."StorageProvider" NOT NULL,
  "storagePath" VARCHAR(255) NOT NULL
);

COMMENT ON TABLE "media"."MediaSource" IS 'A media source';
COMMENT ON COLUMN "media"."MediaSource"."id" IS 'The ID of the media source';
COMMENT ON COLUMN "media"."MediaSource"."mediaType" IS 'The type of media';
COMMENT ON COLUMN "media"."MediaSource"."entityId" IS 'The ID of the entity';
COMMENT ON COLUMN "media"."MediaSource"."entityType" IS 'The type of entity';
COMMENT ON COLUMN "media"."MediaSource"."format" IS 'The format of the media source';
COMMENT ON COLUMN "media"."MediaSource"."fileSize" IS 'The file size of the media source';
COMMENT ON COLUMN "media"."MediaSource"."storageProvider" IS 'The storage provider of the media source';
COMMENT ON COLUMN "media"."MediaSource"."storagePath" IS 'The storage path of the media source';
