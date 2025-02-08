CREATE TABLE "TrackImage" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "track_id" UUID NOT NULL,
  "resolution" VARCHAR(255) NOT NULL,
  "url" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_TrackImage_Track" FOREIGN KEY ("track_id") REFERENCES "Track" ("id")
);

CREATE INDEX "IDX_TrackImage_TrackId" ON "TrackImage" ("track_id");
