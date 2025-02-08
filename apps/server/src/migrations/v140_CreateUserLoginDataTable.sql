CREATE TABLE "UserLoginData" (
  "user_id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password_hash" VARCHAR(255) NOT NULL,
  "role_id" UUID NOT NULL,
  CONSTRAINT "FK_UserLoginData_UserRole" FOREIGN KEY ("role_id") REFERENCES "UserRole" ("id")
);
