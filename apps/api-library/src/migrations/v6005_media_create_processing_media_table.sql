create table "media"."ProcessingMedia" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "entity_id" UUID NOT NULL,
  "entity_type" "media"."EntityType" NOT NULL,
  "media_type" "media"."MediaType" NOT NULL,
  "file_path" VARCHAR(255) NOT NULL,
  "status" "media"."ProcessingStatus" NOT NULL DEFAULT 'PENDING',
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_ProcessingMedia_UserLoginData" FOREIGN KEY ("user_id") REFERENCES "auth"."UserLoginData" ("user_id")
);
