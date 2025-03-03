CREATE TYPE "media"."EntityType" AS ENUM (
  -- Published entities
  'TRACK',          -- References music.Track
  'ALBUM',          -- References music.Album
  'ARTIST',         -- References music.Artist
  -- Draft entities
  'DRAFT_TRACK',    -- References content_management.Draft for tracks
  'DRAFT_ALBUM',    -- References content_management.Draft for albums
  'DRAFT_ARTIST'    -- References content_management.Draft for artists
);
