CREATE TABLE "media"."AudioLink" (
  "audio_id" UUID NOT NULL,
  "track_id" UUID NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_AudioLink_Audio" FOREIGN KEY ("audio_id") REFERENCES "media"."Audio" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_AudioLink_Track" FOREIGN KEY ("track_id") REFERENCES "music"."Track" ("id") ON DELETE CASCADE
);
