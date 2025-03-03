CREATE TABLE "media"."ProcessingQueue" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "task_id" UUID NOT NULL UNIQUE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_ProcessingQueue_ProcessingTask" FOREIGN KEY ("task_id") REFERENCES "media"."ProcessingTask" ("id")
);
