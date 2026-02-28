CREATE TABLE "backstage"."AlbumArtist" (
  "albumId" UUID NOT NULL,
  "artistId" UUID NOT NULL,
  "role" "catalog"."ArtistRole" NOT NULL DEFAULT 'PRIMARY',
  PRIMARY KEY ("albumId", "artistId"),
  CONSTRAINT "FK_AlbumArtist_Album" FOREIGN KEY ("albumId") REFERENCES "backstage"."Album" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_AlbumArtist_Artist" FOREIGN KEY ("artistId") REFERENCES "backstage"."Artist" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "backstage"."AlbumArtist" IS 'A relationship between an album and an artist';

COMMENT ON COLUMN "backstage"."AlbumArtist"."albumId" IS 'Foreign key to the album';
COMMENT ON COLUMN "backstage"."AlbumArtist"."artistId" IS 'Foreign key to the artist';
COMMENT ON COLUMN "backstage"."AlbumArtist"."role" IS 'The role of the artist in the album';
