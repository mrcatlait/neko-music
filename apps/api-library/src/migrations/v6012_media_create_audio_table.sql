CREATE TABLE "media"."Audio" (
  "id" UUID PRIMARY KEY,
  "duration" SMALLINT NOT NULL,
  "bitrate" SMALLINT,
  "format" VARCHAR(20),
  "file_size" BIGINT NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- "waveform_data" JSONB,
  CONSTRAINT "FK_Audio_MediaAsset" FOREIGN KEY ("id")  REFERENCES "media"."MediaAsset" ("id") ON DELETE CASCADE
);
