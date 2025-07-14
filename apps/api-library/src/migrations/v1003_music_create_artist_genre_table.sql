CREATE TABLE "music"."ArtistGenre" (
  "artist_id" UUID NOT NULL,
  "genre_id" UUID NOT NULL,
  "position" SMALLINT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("artist_id", "genre_id"),
  CONSTRAINT "FK_ArtistGenre_Artist" FOREIGN KEY ("artist_id") REFERENCES "music"."Artist" ("id"),
  CONSTRAINT "FK_ArtistGenre_Genre" FOREIGN KEY ("genre_id") REFERENCES "music"."Genre" ("id"),
  CONSTRAINT "CHK_ArtistGenre_Position" CHECK (position >= 0)
);
