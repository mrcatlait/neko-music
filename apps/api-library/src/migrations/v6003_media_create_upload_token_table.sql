CREATE TABLE "media"."UploadToken" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "media_type" "media"."MediaType" NOT NULL,
  "entity_type" "media"."EntityType" NOT NULL,
  "entity_id" UUID NOT NULL,
  -- "max_file_size" BIGINT, -- Optional size limit
  -- "allowed_formats" TEXT[], -- Allowed file formats
  "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_UploadToken_UserLoginData" FOREIGN KEY ("user_id") REFERENCES "auth"."UserLoginData" ("user_id")
);
