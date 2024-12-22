CREATE TABLE "RefreshToken" (
  "refresh_token" VARCHAR(255) NOT NULL,
  "expires_at" TIMESTAMP NOT NULL,
  "user_id" UUID NOT NULL,
  PRIMARY KEY ("user_id"),
  CONSTRAINT "FK_RefreshToken_UserAccount" FOREIGN KEY ("user_id") REFERENCES "UserAccount" ("id")
);
