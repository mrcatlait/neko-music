CREATE TABLE "music"."TrackGenre" (
  "track_id" UUID NOT NULL,
  "genre_id" UUID NOT NULL,
  "position" SMALLINT NOT NULL,
  PRIMARY KEY ("track_id", "genre_id"),
  CONSTRAINT "FK_TrackGenre_Track" FOREIGN KEY ("track_id") REFERENCES "music"."Track" ("id"),
  CONSTRAINT "FK_TrackGenre_Genre" FOREIGN KEY ("genre_id") REFERENCES "music"."Genre" ("id")
);
