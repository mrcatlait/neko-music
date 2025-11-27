CREATE TABLE "media"."Asset" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "mediaType" "media"."MediaType" NOT NULL,
  "storageProvider" "media"."StorageProvider" NOT NULL,
  "storagePath" VARCHAR(255) NOT NULL,
  "publicUrl" VARCHAR(255) NOT NULL,
  "fileSize" BIGINT NOT NULL,
  "format" VARCHAR(20) NOT NULL,
  CONSTRAINT "CHK_Asset_FileSize" CHECK ("fileSize" >= 0)
);

COMMENT ON TABLE "media"."Asset" IS 'A media asset';

COMMENT ON COLUMN "media"."Asset"."id" IS 'The ID of the media asset';
COMMENT ON COLUMN "media"."Asset"."mediaType" IS 'The type of media';
COMMENT ON COLUMN "media"."Asset"."storageProvider" IS 'The storage provider of the media asset';
COMMENT ON COLUMN "media"."Asset"."storagePath" IS 'The storage path of the media asset';
COMMENT ON COLUMN "media"."Asset"."publicUrl" IS 'The public URL of the media asset';
COMMENT ON COLUMN "media"."Asset"."fileSize" IS 'The file size of the media asset';
COMMENT ON COLUMN "media"."Asset"."format" IS 'The format of the media asset';
