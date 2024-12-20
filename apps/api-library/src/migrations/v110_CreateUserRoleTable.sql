CREATE TABLE "UserRole" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(20) NOT NULL UNIQUE,
  "description" VARCHAR(255),
  "default" BOOLEAN NOT NULL DEFAULT FALSE
);
