CREATE TABLE "media"."MediaAsset" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "entityType" "media"."EntityType" NOT NULL,
  "entityId" UUID NOT NULL,
  "sourceId" UUID NOT NULL,
  "storageProvider" "media"."StorageProvider" NOT NULL,
  "storagePath" VARCHAR(255) NOT NULL,
  "publicUrl" VARCHAR(255),
  "fileSize" BIGINT,
  "format" VARCHAR(20) NOT NULL,
  CONSTRAINT "FK_MediaAsset_MediaSource" FOREIGN KEY ("sourceId") REFERENCES "media"."MediaSource" ("id"),
  CONSTRAINT "CHK_MediaAsset_FileSize" CHECK ("fileSize" >= 0)
);

CREATE INDEX "IX_MediaAsset_EntityType_EntityId" ON "media"."MediaAsset" ("entityType", "entityId");

COMMENT ON TABLE "media"."MediaAsset" IS 'A media asset';
COMMENT ON COLUMN "media"."MediaAsset"."id" IS 'The ID of the media asset';
COMMENT ON COLUMN "media"."MediaAsset"."entityType" IS 'The type of entity';
COMMENT ON COLUMN "media"."MediaAsset"."entityId" IS 'Foreign key to the entity';
COMMENT ON COLUMN "media"."MediaAsset"."sourceId" IS 'Foreign key to the media source';
COMMENT ON COLUMN "media"."MediaAsset"."storageProvider" IS 'The storage provider of the media asset';
COMMENT ON COLUMN "media"."MediaAsset"."storagePath" IS 'The storage path of the media asset';
COMMENT ON COLUMN "media"."MediaAsset"."publicUrl" IS 'The public URL of the media asset';
COMMENT ON COLUMN "media"."MediaAsset"."fileSize" IS 'The file size of the media asset';
COMMENT ON COLUMN "media"."MediaAsset"."format" IS 'The format of the media asset';
