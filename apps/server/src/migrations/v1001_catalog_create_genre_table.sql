CREATE TABLE "catalog"."Genre" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL UNIQUE,
  CONSTRAINT "UK_Genre_Name" UNIQUE (name)
);

COMMENT ON TABLE "catalog"."Genre" IS 'A genre of music';

COMMENT ON COLUMN "catalog"."Genre"."name" IS 'The name of the genre';
