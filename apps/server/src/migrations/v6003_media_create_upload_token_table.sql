CREATE TABLE "media"."UploadToken" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "mediaType" "media"."MediaType" NOT NULL,
  "entityType" "media"."EntityType" NOT NULL,
  "entityId" UUID NOT NULL,
  "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  CONSTRAINT "FK_UploadToken_UserAccount" FOREIGN KEY ("userId") REFERENCES "auth"."UserAccount" ("id") ON DELETE CASCADE,
  CONSTRAINT "UK_UploadToken_UserMediaEntity" UNIQUE ("userId", "mediaType", "entityType", "entityId"),
  CONSTRAINT "CHK_UploadToken_ExpiresAt" CHECK ("expiresAt" > CURRENT_TIMESTAMP)
);

COMMENT ON TABLE "media"."UploadToken" IS 'A token for uploading media';
COMMENT ON COLUMN "media"."UploadToken"."id" IS 'The ID of the upload token';
COMMENT ON COLUMN "media"."UploadToken"."userId" IS 'Foreign key to the user';
COMMENT ON COLUMN "media"."UploadToken"."mediaType" IS 'The type of media';
COMMENT ON COLUMN "media"."UploadToken"."entityType" IS 'The type of entity';
COMMENT ON COLUMN "media"."UploadToken"."entityId" IS 'The ID of the entity';
COMMENT ON COLUMN "media"."UploadToken"."expiresAt" IS 'The expiration date of the upload token';
