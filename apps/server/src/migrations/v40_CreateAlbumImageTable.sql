CREATE TABLE "AlbumImage" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "album_id" UUID NOT NULL,
  "resolution" VARCHAR(255) NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_AlbumImage_Album" FOREIGN KEY ("album_id") REFERENCES "Album" ("id")
);

CREATE INDEX "IDX_AlbumImage_AlbumId" ON "AlbumImage" ("album_id");
