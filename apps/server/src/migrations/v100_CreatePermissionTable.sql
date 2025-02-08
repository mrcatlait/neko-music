CREATE TABLE "Permission" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "action" VARCHAR(50) NOT NULL UNIQUE,
  "description" VARCHAR(255)
);
