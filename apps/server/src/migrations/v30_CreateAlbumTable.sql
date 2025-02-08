CREATE TABLE "Album" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL UNIQUE,
  "artist_id" UUID NOT NULL,
  "release_date" DATE NOT NULL,
  CONSTRAINT "FK_Album_Artist" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id")
);

CREATE INDEX "IDX_Album_ArtistId" ON "Album" ("artist_id");
