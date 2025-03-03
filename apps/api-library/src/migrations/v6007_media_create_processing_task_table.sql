CREATE TABLE "media"."ProcessingTask" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "file_id" UUID NOT NULL,
  "task_type" "media"."ProcessingTaskType" NOT NULL,
  "status" "media"."ProcessingStatus" NOT NULL,
  "error_message" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_ProcessingTask_File" FOREIGN KEY ("file_id") REFERENCES "media"."File" ("id")
);
