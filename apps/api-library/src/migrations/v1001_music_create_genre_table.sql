CREATE TABLE "music"."Genre" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "slug" VARCHAR(255) NOT NULL UNIQUE,
  -- "parent_id" UUID,
  -- "metadata" JSONB DEFAULT '{
  --   "translations": {},
  --   "aliases": [],
  --   "description": null
  -- }'::JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  -- CONSTRAINT "FK_Genre_Parent" FOREIGN KEY ("parent_id") REFERENCES "music"."Genre" ("id")
);
