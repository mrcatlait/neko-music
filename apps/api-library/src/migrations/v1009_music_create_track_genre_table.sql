CREATE TABLE "music"."TrackGenre" (
  "track_id" UUID NOT NULL,
  "genre_id" UUID NOT NULL,
  "position" SMALLINT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("track_id", "genre_id"),
  CONSTRAINT "FK_TrackGenre_Track" FOREIGN KEY ("track_id") REFERENCES "music"."Track" ("id"),
  CONSTRAINT "FK_TrackGenre_Genre" FOREIGN KEY ("genre_id") REFERENCES "music"."Genre" ("id"),
  CONSTRAINT "CHK_TrackGenre_Position" CHECK (position >= 0)
);
