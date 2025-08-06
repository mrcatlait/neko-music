CREATE TYPE "playlist"."PlaylistType" AS ENUM ('PRIVATE', 'PUBLIC');

COMMENT ON TYPE "playlist"."PlaylistType" IS 'The type of playlist';