CREATE TABLE "RefreshToken" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "refresh_token" VARCHAR(255) NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "user_id" UUID NOT NULL,
  CONSTRAINT "FK_RefreshToken_UserLoginData" FOREIGN KEY ("user_id") REFERENCES "UserLoginData" ("user_id")
);
