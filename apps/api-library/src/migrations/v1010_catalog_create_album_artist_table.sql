CREATE TABLE "catalog"."AlbumArtist" (
  "albumId" UUID NOT NULL,
  "artistId" UUID NOT NULL,
  "position" SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY ("albumId", "artistId"),
  CONSTRAINT "FK_AlbumArtist_Album" FOREIGN KEY ("albumId") REFERENCES "catalog"."Album" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_AlbumArtist_Artist" FOREIGN KEY ("artistId") REFERENCES "catalog"."Artist" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_AlbumArtist_Position" CHECK (position >= 0)
);

COMMENT ON TABLE "catalog"."AlbumArtist" IS 'A relationship between an album and an artist';
COMMENT ON COLUMN "catalog"."AlbumArtist"."albumId" IS 'Foreign key to the album';
COMMENT ON COLUMN "catalog"."AlbumArtist"."artistId" IS 'Foreign key to the artist';
COMMENT ON COLUMN "catalog"."AlbumArtist"."position" IS 'The position of the artist in the album''s artists';
