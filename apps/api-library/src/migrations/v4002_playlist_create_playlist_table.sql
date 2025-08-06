CREATE TABLE "playlist"."Playlist" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL,
  "description" VARCHAR(255),
  "type" "playlist"."PlaylistType" NOT NULL,
  "userId" UUID NOT NULL,
  CONSTRAINT "FK_Playlist_UserLoginData" FOREIGN KEY ("userId") REFERENCES "auth"."UserLoginData" ("userId") ON DELETE CASCADE
);

COMMENT ON TABLE "playlist"."Playlist" IS 'A playlist';
COMMENT ON COLUMN "playlist"."Playlist"."id" IS 'The ID of the playlist';
COMMENT ON COLUMN "playlist"."Playlist"."name" IS 'The name of the playlist';
COMMENT ON COLUMN "playlist"."Playlist"."description" IS 'The description of the playlist';
COMMENT ON COLUMN "playlist"."Playlist"."type" IS 'The type of playlist';
COMMENT ON COLUMN "playlist"."Playlist"."userId" IS 'Foreign key to the user';
