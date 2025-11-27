CREATE TABLE "catalog"."TrackGenre" (
  "trackId" UUID NOT NULL,
  "genreId" UUID NOT NULL,
  "position" SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY ("trackId", "genreId"),
  CONSTRAINT "FK_TrackGenre_Track" FOREIGN KEY ("trackId") REFERENCES "catalog"."Track" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_TrackGenre_Genre" FOREIGN KEY ("genreId") REFERENCES "catalog"."Genre" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_TrackGenre_Position" CHECK (position >= 0)
);

COMMENT ON TABLE "catalog"."TrackGenre" IS 'A relationship between a track and a genre';

COMMENT ON COLUMN "catalog"."TrackGenre"."trackId" IS 'Foreign key to the track';
COMMENT ON COLUMN "catalog"."TrackGenre"."genreId" IS 'Foreign key to the genre';
COMMENT ON COLUMN "catalog"."TrackGenre"."position" IS 'The position of the genre in the track`s genres';
