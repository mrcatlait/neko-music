CREATE TABLE "UserAccount" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "username" VARCHAR(255) NOT NULL UNIQUE
);
