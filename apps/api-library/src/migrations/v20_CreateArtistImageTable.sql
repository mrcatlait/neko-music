CREATE TABLE "ArtistImage" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "artist_id" UUID NOT NULL,
  "resolution" VARCHAR(255) NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_ArtistImage_Artist" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id")
);

CREATE INDEX "IDX_ArtistImage_ArtistId" ON "ArtistImage" ("artist_id");
