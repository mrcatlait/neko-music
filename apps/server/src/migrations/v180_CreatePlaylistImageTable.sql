CREATE TABLE "PlaylistImage" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "playlist_id" UUID NOT NULL,
  "resolution" VARCHAR(255) NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_PlaylistImage_Playlist" FOREIGN KEY ("playlist_id") REFERENCES "Playlist" ("id")
);

CREATE INDEX "IDX_PlaylistImage_PlaylistId" ON "PlaylistImage" ("playlist_id");
