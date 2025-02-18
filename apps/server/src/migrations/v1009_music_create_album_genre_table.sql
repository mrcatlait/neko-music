CREATE TABLE "music"."AlbumGenre" (
  "album_id" UUID NOT NULL,
  "genre_id" UUID NOT NULL,
  "position" SMALLINT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("album_id", "genre_id"),
  CONSTRAINT "FK_AlbumGenre_Album" FOREIGN KEY ("album_id") REFERENCES "music"."Album" ("id"),
  CONSTRAINT "FK_AlbumGenre_Genre" FOREIGN KEY ("genre_id") REFERENCES "music"."Genre" ("id")
);
