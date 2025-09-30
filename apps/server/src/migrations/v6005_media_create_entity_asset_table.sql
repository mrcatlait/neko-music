CREATE TABLE "media"."EntityAsset" (
  "entityType" "media"."EntityType" NOT NULL,
  "entityId" UUID NOT NULL,
  "assetId" UUID NOT NULL,
  CONSTRAINT "FK_EntityAsset_Asset" FOREIGN KEY ("assetId") REFERENCES "media"."Asset" ("id") ON DELETE CASCADE
);

CREATE INDEX "IX_EntityAsset_EntityType_EntityId" ON "media"."EntityAsset" ("entityType", "entityId");

COMMENT ON TABLE "media"."EntityAsset" IS 'A relationship between an entity and a media asset';
COMMENT ON COLUMN "media"."EntityAsset"."assetId" IS 'Foreign key to the media asset';
COMMENT ON COLUMN "media"."EntityAsset"."entityType" IS 'The type of entity';
COMMENT ON COLUMN "media"."EntityAsset"."entityId" IS 'Foreign key to the entity';
