CREATE TABLE "media"."AlbumArtworkVariant" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "album_artwork_id" UUID NOT NULL,
  "format" VARCHAR(20) NOT NULL,
  "storage_provider" "media"."StorageProvider" NOT NULL,
  "storage_path" VARCHAR(255) NOT NULL,
  "public_url" VARCHAR(255),
  "size" "media"."ArtworkSize" NOT NULL,
  "file_size" BIGINT NOT NULL,
  "file_hash" VARCHAR(64) NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_AlbumArtworkVariant_AlbumArtwork" FOREIGN KEY ("album_artwork_id") REFERENCES "media"."AlbumArtwork" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_AlbumArtworkVariant_AlbumArtwork_Format_Size" UNIQUE ("album_artwork_id", "format", "size"),
  CONSTRAINT "CHK_AlbumArtworkVariant_FileSize" CHECK (file_size > 0)
);
