CREATE TABLE "media"."ArtistArtwork" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "artist_id" UUID NOT NULL,
  "background_color" VARCHAR(7),
  "text_color" VARCHAR(7),
  "processing_status" "media"."ProcessingStatus" NOT NULL DEFAULT 'PENDING',
  "processing_attempts" SMALLINT NOT NULL DEFAULT 0,
  "processing_error" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
