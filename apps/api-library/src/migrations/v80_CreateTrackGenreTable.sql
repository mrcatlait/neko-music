CREATE TABLE "TrackGenre" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "track_id" UUID NOT NULL,
  "genre_id" UUID NOT NULL,
  CONSTRAINT "FK_TrackGenre_Track" FOREIGN KEY ("track_id") REFERENCES "Track" ("id"),
  CONSTRAINT "FK_TrackGenre_Genre" FOREIGN KEY ("genre_id") REFERENCES "Genre" ("id"),
  CONSTRAINT "UQ_TrackGenre_Track_Genre" UNIQUE ("track_id", "genre_id")
);

CREATE INDEX "IDX_TrackGenre_TrackId" ON "TrackGenre" ("track_id");

CREATE INDEX "IDX_TrackGenre_GenreId" ON "TrackGenre" ("genre_id");

