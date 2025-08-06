CREATE TABLE "media"."MediaSource" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "sourceType" "media"."SourceType" NOT NULL,
  "format" VARCHAR(20),
  "fileSize" BIGINT,
  "storageProvider" "media"."StorageProvider" NOT NULL,
  "storagePath" VARCHAR(255) NOT NULL
);

COMMENT ON TABLE "media"."MediaSource" IS 'A media source';
COMMENT ON COLUMN "media"."MediaSource"."id" IS 'The ID of the media source';
COMMENT ON COLUMN "media"."MediaSource"."sourceType" IS 'The type of media source';
COMMENT ON COLUMN "media"."MediaSource"."format" IS 'The format of the media source';
COMMENT ON COLUMN "media"."MediaSource"."fileSize" IS 'The file size of the media source';
COMMENT ON COLUMN "media"."MediaSource"."storageProvider" IS 'The storage provider of the media source';
COMMENT ON COLUMN "media"."MediaSource"."storagePath" IS 'The storage path of the media source';
