CREATE TYPE "ArtistRole" AS ENUM ('featuring', 'primary', 'producer', 'remixer');

CREATE TABLE "TrackArtist" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "track_id" UUID NOT NULL,
  "artist_id" UUID NOT NULL,
  "role" "ArtistRole" NOT NULL,
  CONSTRAINT "FK_TrackArtist_Track" FOREIGN KEY ("track_id") REFERENCES "Track" ("id"),
  CONSTRAINT "FK_TrackArtist_Artist" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id"),
  CONSTRAINT "UQ_TrackArtist_Track_Artist_Role" UNIQUE ("track_id", "artist_id", "role")
);

CREATE INDEX "IDX_TrackArtist_TrackId" ON "TrackArtist" ("track_id");

CREATE INDEX "IDX_TrackArtist_ArtistId" ON "TrackArtist" ("artist_id");
