CREATE TABLE "PlaylistTrack" (
  "playlist_id" UUID NOT NULL,
  "track_id" UUID NOT NULL,
  "position" INTEGER NOT NULL,
  PRIMARY KEY ("playlist_id", "track_id"),
  CONSTRAINT "FK_PlaylistTrack_Playlist" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id"),
  CONSTRAINT "FK_PlaylistTrack_Track" FOREIGN KEY ("track_id") REFERENCES "Track" ("id")
);
