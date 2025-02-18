CREATE TABLE "user"."UserAccount" (
  "user_id" UUID PRIMARY KEY,
  "display_name" VARCHAR(255) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FK_UserAccount_UserLoginData" FOREIGN KEY ("user_id") REFERENCES "auth"."UserLoginData" ("user_id")
);
