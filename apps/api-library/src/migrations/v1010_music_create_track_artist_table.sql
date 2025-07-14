CREATE TABLE "music"."TrackArtist" (
  "track_id" UUID NOT NULL,
  "artist_id" UUID NOT NULL,
  "position" SMALLINT NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("track_id", "artist_id", "role"),
  CONSTRAINT "FK_TrackArtist_Track" FOREIGN KEY ("track_id") REFERENCES "music"."Track" ("id"),
  CONSTRAINT "FK_TrackArtist_Artist" FOREIGN KEY ("artist_id") REFERENCES "music"."Artist" ("id"),
  CONSTRAINT "CHK_TrackArtist_Position" CHECK (position >= 0)
);
