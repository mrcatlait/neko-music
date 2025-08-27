CREATE TABLE "auth"."Permission" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(50) NOT NULL UNIQUE,
  "description" VARCHAR(255)
);

COMMENT ON TABLE "auth"."Permission" IS 'A permission';
COMMENT ON COLUMN "auth"."Permission"."name" IS 'The name of the permission';
COMMENT ON COLUMN "auth"."Permission"."description" IS 'The description of the permission';
