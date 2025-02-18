CREATE TABLE "playlist"."PlaylistImage" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "playlist_id" UUID NOT NULL,
  "resolution" VARCHAR(255) NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_PlaylistImage_Playlist" FOREIGN KEY ("playlist_id") REFERENCES "playlist"."Playlist" ("id")
);
