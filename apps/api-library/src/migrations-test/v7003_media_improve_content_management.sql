-- Create content management status enum
CREATE TYPE "content_management"."ContentStatus" AS ENUM (
  'DRAFT',              -- Initial draft state
  'MEDIA_UPLOADING',    -- Media is being uploaded
  'MEDIA_PROCESSING',   -- Media is being processed
  'MEDIA_READY',        -- Media is ready for review
  'REVIEW_REQUIRED',    -- Content needs review
  'REVIEW_IN_PROGRESS', -- Content is being reviewed
  'APPROVED',           -- Content is approved
  'REJECTED',           -- Content is rejected
  'PUBLISHED',          -- Content is published
  'FAILED'              -- Processing failed
);

-- Create media processing status enum
CREATE TYPE "media"."ProcessingStatus" AS ENUM (
  'PENDING',           -- Waiting to be processed
  'PROCESSING',        -- Currently processing
  'COMPLETED',         -- Processing completed
  'FAILED',            -- Processing failed
  'CANCELLED'          -- Processing cancelled
);

-- Create content media tracking table
CREATE TABLE "content_management"."ContentMedia" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "draft_id" UUID NOT NULL,
  "file_id" UUID NOT NULL,
  "media_type" "media"."MediaType" NOT NULL,
  "processing_status" "media"."ProcessingStatus" NOT NULL DEFAULT 'PENDING',
  "processing_metadata" JSONB NOT NULL DEFAULT '{}'::JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_ContentMedia_DraftEntity" 
    FOREIGN KEY ("draft_id") 
    REFERENCES "content_management"."DraftEntity" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_ContentMedia_File" 
    FOREIGN KEY ("file_id") 
    REFERENCES "media"."File" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_ContentMedia_DraftType" 
    UNIQUE ("draft_id", "media_type")
);

-- Add content status to DraftEntity
ALTER TABLE "content_management"."DraftEntity"
ADD COLUMN "content_status" "content_management"."ContentStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN "media_status" "content_management"."ContentStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN "review_status" "content_management"."ContentStatus" NOT NULL DEFAULT 'DRAFT';
