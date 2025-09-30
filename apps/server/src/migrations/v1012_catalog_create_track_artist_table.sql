CREATE TABLE "catalog"."TrackArtist" (
  "trackId" UUID NOT NULL,
  "artistId" UUID NOT NULL,
  "role" "catalog"."ArtistRole" NOT NULL DEFAULT 'PRIMARY',
  PRIMARY KEY ("trackId", "artistId"),
  CONSTRAINT "FK_TrackArtist_Track" FOREIGN KEY ("trackId") REFERENCES "catalog"."Track" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_TrackArtist_Artist" FOREIGN KEY ("artistId") REFERENCES "catalog"."Artist" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "catalog"."TrackArtist" IS 'A relationship between a track and an artist';
COMMENT ON COLUMN "catalog"."TrackArtist"."trackId" IS 'Foreign key to the track';
COMMENT ON COLUMN "catalog"."TrackArtist"."artistId" IS 'Foreign key to the artist';
COMMENT ON COLUMN "catalog"."TrackArtist"."role" IS 'The role of the artist in the track';
