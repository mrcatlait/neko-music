CREATE TABLE "Track" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL UNIQUE,
  "release_date" DATE NOT NULL,
  "album_id" UUID,
  "duration" SMALLINT NOT NULL,
  CONSTRAINT "FK_Track_Album" FOREIGN KEY ("album_id") REFERENCES "Album" ("id")
);

CREATE INDEX "IDX_Track_AlbumId" ON "Track" ("album_id");
