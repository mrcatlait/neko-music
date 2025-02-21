CREATE TABLE "music"."ArtistNote" (
  "artist_id" UUID NOT NULL,
  "short_text" TEXT,
  "standard_text" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("artist_id"),
  CONSTRAINT "FK_ArtistNote_Artist" FOREIGN KEY ("artist_id") REFERENCES "music"."Artist" ("id")
);
