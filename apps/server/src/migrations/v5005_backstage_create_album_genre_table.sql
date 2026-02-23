CREATE TABLE "backstage"."AlbumGenre" (
  "albumId" UUID NOT NULL,
  "genreId" UUID NOT NULL,
  "position" SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY ("albumId", "genreId"),
  CONSTRAINT "FK_AlbumGenre_Album" FOREIGN KEY ("albumId") REFERENCES "backstage"."Album" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_AlbumGenre_CatalogGenre" FOREIGN KEY ("genreId") REFERENCES "catalog"."Genre" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_AlbumGenre_Position" CHECK (position >= 0)
);

COMMENT ON TABLE "backstage"."AlbumGenre" IS 'A relationship between an album and a genre';

COMMENT ON COLUMN "backstage"."AlbumGenre"."albumId" IS 'Foreign key to the album';
COMMENT ON COLUMN "backstage"."AlbumGenre"."genreId" IS 'Foreign key to the genre';
COMMENT ON COLUMN "backstage"."AlbumGenre"."position" IS 'The position of the genre in the album`s genres';
