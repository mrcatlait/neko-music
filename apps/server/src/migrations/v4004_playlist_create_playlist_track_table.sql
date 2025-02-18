CREATE TABLE "playlist"."PlaylistTrack" (
  "playlist_id" UUID NOT NULL,
  "track_id" UUID NOT NULL,
  "position" INTEGER NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("playlist_id", "track_id"),
  CONSTRAINT "FK_PlaylistTrack_Playlist" FOREIGN KEY ("playlist_id") REFERENCES "playlist"."Playlist" ("id"),
  CONSTRAINT "FK_PlaylistTrack_Track" FOREIGN KEY ("track_id") REFERENCES "music"."Track" ("id")
);
