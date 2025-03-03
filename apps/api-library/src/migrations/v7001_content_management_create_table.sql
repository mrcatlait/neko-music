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

-- CREATE TABLE "content_management"."DraftEntity" (
--   "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   "entity_type" "content_management"."EntityType" NOT NULL,
--   "target_id" UUID,
--   "creator_id" UUID NOT NULL,
--   "status" "content_management"."PublishStatus" NOT NULL,
--   "content" JSONB NOT NULL,
--   "error_message" TEXT,
--   "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   CONSTRAINT "FK_DraftEntity_UserLoginData" FOREIGN KEY ("creator_id") REFERENCES "auth"."UserLoginData" ("user_id")
-- );

-- CREATE TABLE "content_management"."DraftArtist" (
--   "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   "creator_id" UUID NOT NULL,
--   "status" "content_management"."PublishStatus" NOT NULL,
--   "content" JSONB NOT NULL,
--   "target_id" UUID,
--   "error_message" TEXT,
--   "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   CONSTRAINT "FK_DraftArtist_UserLoginData" FOREIGN KEY ("creator_id") REFERENCES "auth"."UserLoginData" ("user_id")
-- );

-- CREATE TABLE "content_management"."DraftAlbum" (
--   "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   "creator_id" UUID NOT NULL,
--   "status" "content_management"."PublishStatus" NOT NULL,
--   "content" JSONB NOT NULL,
--   "target_id" UUID,
--   "error_message" TEXT,
--   "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   CONSTRAINT "FK_DraftAlbum_UserLoginData" FOREIGN KEY ("creator_id") REFERENCES "auth"."UserLoginData" ("user_id")
-- );

-- CREATE TABLE "content_management"."DraftTrack" (
--   "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   "draft_album_id" UUID,
--   "album_id" UUID,
--   "creator_id" UUID NOT NULL,
--   "status" "content_management"."PublishStatus" NOT NULL,
--   "content" JSONB NOT NULL,
--   "target_id" UUID,
--   "error_message" TEXT,
--   "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   CONSTRAINT "FK_DraftTrack_DraftAlbum" FOREIGN KEY ("draft_album_id") REFERENCES "content_management"."DraftAlbum" ("id") ON DELETE CASCADE,
--   CONSTRAINT "FK_DraftTrack_PublishedAlbum" FOREIGN KEY ("album_id") REFERENCES "music"."Album" ("id"),
--   CONSTRAINT "FK_DraftTrack_UserLoginData" FOREIGN KEY ("creator_id") REFERENCES "auth"."UserLoginData" ("user_id"),
--   CONSTRAINT "CK_DraftTrack_AlbumReference" CHECK (
--     (album_id IS NOT NULL AND draft_album_id IS NULL) OR 
--     (album_id IS NULL AND draft_album_id IS NOT NULL)
--   )
-- );

-- CREATE TABLE "content_management"."MediaUploadLink" (
--   "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   "draft_id" UUID NOT NULL,
--   "upload_token_id" UUID NOT NULL,
--   "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
--   CONSTRAINT "FK_MediaUploadLink_DraftEntity" FOREIGN KEY ("draft_entity_id") REFERENCES "content_management"."DraftEntity" ("id") ON DELETE CASCADE,
--   CONSTRAINT "UQ_MediaUploadLink_Token" UNIQUE ("upload_token_id")
-- );

CREATE TABLE "content_management"."DraftEntity" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "entity_type" "content_management"."EntityType" NOT NULL,
  "target_id" UUID,
  "creator_id" UUID NOT NULL,
  "status" "content_management"."PublishStatus" NOT NULL,
  "content" JSONB NOT NULL,
  "error_message" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_DraftEntity_UserLoginData" FOREIGN KEY ("creator_id") REFERENCES "auth"."UserLoginData" ("user_id")
);

CREATE TABLE "media"."FileMetadata" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "file_name" TEXT NOT NULL,
  "file_size" BIGINT NOT NULL,
  "file_type" TEXT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "content_management"."MediaLink" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "draft_id" UUID NOT NULL,
  "media_id" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_MediaLink_DraftEntity" FOREIGN KEY ("draft_id") REFERENCES "content_management"."DraftEntity" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_MediaLink_FileMetadata" FOREIGN KEY ("media_id") REFERENCES "media"."FileMetadata" ("id"),
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(10) CHECK (entity_type IN ('album', 'track')),
    entity_id UUID NOT NULL,
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'approved', 'rejected', 'requires_changes')) DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (entity_id) REFERENCES albums(id) ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE review_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE "cms"."Draft" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "entity_type" "cms"."entity_type" NOT NULL,
  "entity_id" UUID,                              -- Nullable for new entities
  "draft_type" "cms"."draft_type" NOT NULL,
  "temp_id" UUID,                                -- Temporary ID for new entities
  "version" INTEGER NOT NULL DEFAULT 1,
  "status" "cms"."draft_status" NOT NULL DEFAULT 'DRAFT',
  "data" JSONB NOT NULL,
  "changes" JSONB NOT NULL,
  "metadata" JSONB NOT NULL DEFAULT '{
    "locale": "en",
    "regions": ["global"],
    "publish_at": null,
    "expire_at": null
  }'::JSONB,
  "created_by" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_by" UUID NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Either entity_id or temp_id must be set
  CONSTRAINT "check_entity_reference" CHECK (
    (entity_id IS NOT NULL AND temp_id IS NULL) OR
    (entity_id IS NULL AND temp_id IS NOT NULL)
  )
);

CREATE TABLE "cms"."Review" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "draft_id" UUID NOT NULL,
  "status" "cms"."draft_status" NOT NULL,
  "notes" TEXT,
  "reviewed_by" UUID NOT NULL,
  "reviewed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_Review_Draft" FOREIGN KEY ("draft_id") 
    REFERENCES "cms"."Draft" ("id") ON DELETE CASCADE
);