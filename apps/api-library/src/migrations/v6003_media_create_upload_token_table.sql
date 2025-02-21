CREATE TABLE "media"."UploadToken" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "entity_id" UUID NOT NULL,
  "entity_type" "media"."EntityType" NOT NULL,
  "media_type" "media"."MediaType" NOT NULL,
  "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_UploadToken_UserLoginData" FOREIGN KEY ("user_id") REFERENCES "auth"."UserLoginData" ("user_id")
);
