CREATE TABLE "playlist"."PlaylistTrack" (
  "playlistId" UUID NOT NULL,
  "trackId" UUID NOT NULL,
  "position" SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY ("playlistId", "trackId"),
  CONSTRAINT "FK_PlaylistTrack_Playlist" FOREIGN KEY ("playlistId") REFERENCES "playlist"."Playlist" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_PlaylistTrack_Track" FOREIGN KEY ("trackId") REFERENCES "catalog"."Track" ("id") ON DELETE CASCADE,
  CONSTRAINT "CHK_PlaylistTrack_Position" CHECK (position >= 0)
);

CREATE INDEX "IX_PlaylistTrack_PlaylistId_Position" ON "playlist"."PlaylistTrack" ("playlistId", "position");

COMMENT ON TABLE "playlist"."PlaylistTrack" IS 'A relationship between a playlist and a track';
COMMENT ON COLUMN "playlist"."PlaylistTrack"."playlistId" IS 'Foreign key to the playlist';
COMMENT ON COLUMN "playlist"."PlaylistTrack"."trackId" IS 'Foreign key to the track';
COMMENT ON COLUMN "playlist"."PlaylistTrack"."position" IS 'The position of the track in the playlist';
