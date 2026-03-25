CREATE TABLE "catalog"."Genre" (
  "id" UUID PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "slug" VARCHAR(255) NOT NULL UNIQUE
);

COMMENT ON TABLE "catalog"."Genre" IS 'A genre of music';

COMMENT ON COLUMN "catalog"."Genre"."name" IS 'The name of the genre';
COMMENT ON COLUMN "catalog"."Genre"."slug" IS 'The slug of the genre';
