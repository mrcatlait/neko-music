CREATE TYPE "content_management"."EntityType" AS ENUM (
  'ARTIST',
  'ALBUM',
  'TRACK',
  'PLAYLIST'
);

CREATE TYPE "content_management"."WorkflowStatus" AS ENUM (
  'DRAFT',
  'MEDIA_PENDING',
  'READY_FOR_REVIEW',
  'IN_REVIEW',
  'APPROVED',
  'REJECTED',
  'PUBLISHED',
  'ARCHIVED'
);

CREATE TABLE "content_management"."Draft" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "entity_type" "content_management"."EntityType" NOT NULL,
  "published_entity_id" UUID,
  "workflow_status" "content_management"."WorkflowStatus" NOT NULL DEFAULT 'DRAFT',
  "version" INTEGER NOT NULL DEFAULT 1,
  "content" JSONB NOT NULL,
  "metadata" JSONB NOT NULL DEFAULT '{
    "locale": "en",
    "regions": ["global"],
    "publish_at": null
  }'::JSONB,
  "error_message" TEXT,
  "created_by" UUID NOT NULL,
  "updated_by" UUID,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_Draft_UserLoginData_Creator" FOREIGN KEY ("created_by") 
    REFERENCES "auth"."UserLoginData" ("user_id"),
  CONSTRAINT "FK_Draft_UserLoginData_Updater" FOREIGN KEY ("updated_by") 
    REFERENCES "auth"."UserLoginData" ("user_id")
);

CREATE TABLE "content_management"."DraftMedia" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "draft_id" UUID NOT NULL,
  "file_id" UUID NOT NULL,
  "media_role" VARCHAR(50) NOT NULL, -- e.g., 'primary_image', 'audio_track', 'background'
  "order_index" SMALLINT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_DraftMedia_Draft" FOREIGN KEY ("draft_id") 
    REFERENCES "content_management"."Draft" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_DraftMedia_File" FOREIGN KEY ("file_id") 
    REFERENCES "media"."File" ("id"),
  CONSTRAINT "UQ_DraftMedia_Role" UNIQUE ("draft_id", "media_role", "order_index")
);
