CREATE TABLE "catalog"."AlbumArtwork" (
  "albumId" UUID PRIMARY KEY NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  "sizes" VARCHAR(255)[] NOT NULL,
  "dominantColor" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_AlbumArtwork_Album" FOREIGN KEY ("albumId") REFERENCES "catalog"."Album" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_AlbumArtwork_Sizes" CHECK (array_length("sizes", 1) > 0)
);

COMMENT ON TABLE "catalog"."AlbumArtwork" IS 'A relationship between an album and an artwork';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."albumId" IS 'Foreign key to the album';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."url" IS 'The URL of the artwork';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."sizes" IS 'Available sizes of the artwork';
COMMENT ON COLUMN "catalog"."AlbumArtwork"."dominantColor" IS 'The dominant color of the artwork';
