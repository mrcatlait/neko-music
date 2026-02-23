CREATE TABLE "backstage"."TrackArtist" (
  "trackId" UUID NOT NULL,
  "artistId" UUID NOT NULL,
  "role" "catalog"."ArtistRole" NOT NULL DEFAULT 'PRIMARY',
  PRIMARY KEY ("trackId", "artistId"),
  CONSTRAINT "FK_TrackArtist_Track" FOREIGN KEY ("trackId") REFERENCES "backstage"."Track" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_TrackArtist_Artist" FOREIGN KEY ("artistId") REFERENCES "backstage"."Artist" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "backstage"."TrackArtist" IS 'A relationship between a track and an artist';

COMMENT ON COLUMN "backstage"."TrackArtist"."trackId" IS 'Foreign key to the track';
COMMENT ON COLUMN "backstage"."TrackArtist"."artistId" IS 'Foreign key to the artist';
COMMENT ON COLUMN "backstage"."TrackArtist"."role" IS 'The role of the artist in the track';
