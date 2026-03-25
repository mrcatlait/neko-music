CREATE TABLE "catalog"."AlbumGenre" (
  "albumId" UUID NOT NULL,
  "genreId" UUID NOT NULL,
  "position" SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY ("albumId", "genreId"),
  CONSTRAINT "FK_AlbumGenre_Album" FOREIGN KEY ("albumId") REFERENCES "catalog"."Album" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_AlbumGenre_Genre" FOREIGN KEY ("genreId") REFERENCES "catalog"."Genre" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_AlbumGenre_Position" CHECK (position >= 0)
);

COMMENT ON TABLE "catalog"."AlbumGenre" IS 'A relationship between an album and a genre';

COMMENT ON COLUMN "catalog"."AlbumGenre"."albumId" IS 'Foreign key to the album';
COMMENT ON COLUMN "catalog"."AlbumGenre"."genreId" IS 'Foreign key to the genre';
COMMENT ON COLUMN "catalog"."AlbumGenre"."position" IS 'The position of the genre in the album`s genres';
