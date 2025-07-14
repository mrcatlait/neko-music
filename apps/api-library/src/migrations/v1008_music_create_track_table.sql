CREATE TABLE "music"."Track" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" VARCHAR(255) NOT NULL,
  "album_id" UUID NOT NULL,
  "track_number" SMALLINT NOT NULL,
  "disk_number" SMALLINT NOT NULL,
  "release_date" DATE NOT NULL,
  "duration" SMALLINT NOT NULL,
  "has_lyrics" BOOLEAN NOT NULL DEFAULT FALSE,
  "explicit" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_Track_Album" FOREIGN KEY ("album_id") REFERENCES "music"."Album" ("id"),
  CONSTRAINT "CHK_Track_TrackNumber" CHECK (track_number > 0),
  CONSTRAINT "CHK_Track_DiskNumber" CHECK (disk_number > 0),
  CONSTRAINT "CHK_Track_Duration" CHECK (duration > 0 AND duration < 36000)
);
