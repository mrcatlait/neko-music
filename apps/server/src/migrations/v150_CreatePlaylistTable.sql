CREATE TYPE "PlaylistType" AS ENUM ('private', 'public');

CREATE TABLE "Playlist" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255),
  "type" "PlaylistType" NOT NULL,
  "user_id" UUID NOT NULL,
  CONSTRAINT "FK_Playlist_UserAccount" FOREIGN KEY ("user_id") REFERENCES "UserAccount" ("id")
);
