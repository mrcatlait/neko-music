CREATE TABLE "backstage"."ArtistGenre" (
  "artistId" UUID NOT NULL,
  "genreId" UUID NOT NULL,
  "position" SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY ("artistId", "genreId"),
  CONSTRAINT "FK_ArtistGenre_Artist" FOREIGN KEY ("artistId") REFERENCES "backstage"."Artist" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_ArtistGenre_CatalogGenre" FOREIGN KEY ("genreId") REFERENCES "catalog"."Genre" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_ArtistGenre_Position" CHECK (position >= 0)
);

COMMENT ON TABLE "catalog"."ArtistGenre" IS 'A relationship between an artist and a genre';

COMMENT ON COLUMN "catalog"."ArtistGenre"."artistId" IS 'Foreign key to the artist';
COMMENT ON COLUMN "catalog"."ArtistGenre"."genreId" IS 'Foreign key to the genre';
COMMENT ON COLUMN "catalog"."ArtistGenre"."position" IS 'The position of the genre in the artist''s genres';
