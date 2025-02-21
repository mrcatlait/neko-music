CREATE TABLE "music"."ArtistImage" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "artist_id" UUID NOT NULL,
  "resolution" VARCHAR(255) NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_ArtistImage_Artist" FOREIGN KEY ("artist_id") REFERENCES "music"."Artist" ("id")
);
