CREATE TYPE "playlist"."PlaylistType" AS ENUM ('PRIVATE', 'PUBLIC', 'COLLABORATIVE');

COMMENT ON TYPE "playlist"."PlaylistType" IS 'The type of playlist';