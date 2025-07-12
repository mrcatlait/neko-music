CREATE TYPE "content_management"."PublishStatus" AS ENUM (
  'DRAFT',
  'MEDIA_UPLOAD',
  'MEDIA_PROCESSING',
  'REVIEW_REQUIRED',
  'APPROVED',
  'REJECTED',
  'PUBLISHED',
  'FAILED'
);

CREATE TYPE "content_management"."EntityType" AS ENUM (
  'Album',
  'Track',
  'Artist'
);

CREATE TABLE "content_management"."Draft" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "status" "content_management"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
  "entity_type" "content_management"."EntityType" NOT NULL,
  "entity_id" UUID,
  "data" JSONB NOT NULL,
  "changes" JSONB NOT NULL DEFAULT '{}'::JSONB,
  "created_by" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" UUID NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE "content_management"."ReviewDecision" AS ENUM (
  'APPROVED',
  'REJECTED',
  'REVIEW_REQUIRED',
  'CHANGES_REQUIRED'
);

CREATE TABLE "content_management"."Review" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "draft_id" UUID NOT NULL,
  "decision" "content_management"."ReviewDecision" NOT NULL,
  "notes" TEXT,
  "reviewed_by" UUID NOT NULL,
  "reviewed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_Review_Draft" FOREIGN KEY ("draft_id") REFERENCES "content_management"."Draft" ("id")
);

CREATE TABLE "content_management"."Version" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "entity_type" "content_management"."EntityType" NOT NULL,
  "entity_id" UUID NOT NULL,
  "version_number" INTEGER NOT NULL,
  "data" JSONB NOT NULL,
  "changelog" TEXT,
  "created_by" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UQ_Version_Entity_Number" UNIQUE ("entity_type", "entity_id", "version_number")
);

CREATE OR REPLACE FUNCTION "content_management"."handle_draft_publishing"()
RETURNS TRIGGER AS $$
BEGIN
    -- If the status is changing to PUBLISHED
    IF NEW.status = 'PUBLISHED' AND OLD.status != 'PUBLISHED' THEN
        -- Insert the new version
        INSERT INTO "content_management"."Version" (
            "entity_type",
            "entity_id",
            "version_number",
            "data",
            "changelog",
            "created_by"
        )
        SELECT 
            NEW.entity_type,
            NEW.entity_id,
            COALESCE((
                SELECT MAX(version_number) + 1
                FROM "content_management"."Version"
                WHERE entity_type = NEW.entity_type 
                AND entity_id = NEW.entity_id
            ), 1),
            NEW.data,
            'Published from draft ' || NEW.id,
            NEW.updated_by;

        -- The draft can be deleted after successful publishing
        DELETE FROM "content_management"."Draft" WHERE id = NEW.id;
        
        RETURN NULL; -- Since we're deleting the draft
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "draft_publishing_trigger"
    BEFORE UPDATE ON "content_management"."Draft"
    FOR EACH ROW
    EXECUTE FUNCTION "content_management"."handle_draft_publishing"();
