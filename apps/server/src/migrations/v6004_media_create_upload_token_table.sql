CREATE TABLE "media"."UploadToken" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "mediaType" "media"."MediaType" NOT NULL,
  "entityType" "media"."EntityType" NOT NULL,
  "entityId" UUID NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP NOT NULL
);

COMMENT ON TABLE "media"."UploadToken" IS 'A media upload token';

COMMENT ON COLUMN "media"."UploadToken"."id" IS 'The ID of the media upload token';
COMMENT ON COLUMN "media"."UploadToken"."userId" IS 'The ID of the user';
COMMENT ON COLUMN "media"."UploadToken"."mediaType" IS 'The type of media';
COMMENT ON COLUMN "media"."UploadToken"."entityType" IS 'The type of entity';
COMMENT ON COLUMN "media"."UploadToken"."entityId" IS 'The ID of the entity';
COMMENT ON COLUMN "media"."UploadToken"."createdAt" IS 'The date and time the upload token was created';
COMMENT ON COLUMN "media"."UploadToken"."expiresAt" IS 'The date and time the upload token expires';
