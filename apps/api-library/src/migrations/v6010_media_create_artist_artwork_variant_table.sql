CREATE TABLE "media"."ArtistArtworkVariant" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "artist_artwork_id" UUID NOT NULL,
  "format" VARCHAR(20) NOT NULL,
  "storage_provider" "media"."StorageProvider" NOT NULL,
  "storage_path" VARCHAR(255) NOT NULL,
  "public_url" VARCHAR(255),
  "size" "media"."ArtworkSize" NOT NULL,
  "file_size" BIGINT NOT NULL,
  "file_hash" VARCHAR(64) NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_ArtistArtworkVariant_ArtistArtwork" FOREIGN KEY ("artist_artwork_id") REFERENCES "media"."ArtistArtwork" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_ArtistArtworkVariant_ArtistArtwork_Format_Size" UNIQUE ("artist_artwork_id", "format", "size"),
  CONSTRAINT "CHK_ArtistArtworkVariant_FileSize" CHECK (file_size > 0)
);
