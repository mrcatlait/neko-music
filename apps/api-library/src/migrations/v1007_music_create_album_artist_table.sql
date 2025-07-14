CREATE TABLE "music"."AlbumArtist" (
  "album_id" UUID NOT NULL,
  "artist_id" UUID NOT NULL,
  "position" SMALLINT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("album_id", "artist_id", "role"),
  CONSTRAINT "FK_AlbumArtist_Album" FOREIGN KEY ("album_id") REFERENCES "music"."Album" ("id"),
  CONSTRAINT "FK_AlbumArtist_Artist" FOREIGN KEY ("artist_id") REFERENCES "music"."Artist" ("id"),
  CONSTRAINT "CHK_AlbumArtist_Position" CHECK (position >= 0)
);
