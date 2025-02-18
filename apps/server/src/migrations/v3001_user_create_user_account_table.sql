CREATE TABLE "user"."UserAccount" (
  "user_id" UUID PRIMARY KEY,
  "display_name" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_UserAccount_UserLoginData" FOREIGN KEY ("user_id") REFERENCES "auth"."UserLoginData" ("user_id")
);
