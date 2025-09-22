CREATE TABLE "catalog"."ArtistArtwork" (
  "artistId" UUID PRIMARY KEY NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  "sizes" VARCHAR(255)[] NOT NULL,
  "dominantColor" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_ArtistArtwork_Artist" FOREIGN KEY ("artistId") REFERENCES "catalog"."Artist" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_ArtistArtwork_Sizes" CHECK (array_length("sizes", 1) > 0)
);

COMMENT ON TABLE "catalog"."ArtistArtwork" IS 'A relationship between an artist and an artwork';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."artistId" IS 'Foreign key to the artist';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."url" IS 'The URL of the artwork';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."sizes" IS 'Available sizes of the artwork';
COMMENT ON COLUMN "catalog"."ArtistArtwork"."dominantColor" IS 'The dominant color of the artwork';
