CREATE TABLE "auth"."UserRole" (
  "user_id" UUID NOT NULL,
  "role_id" UUID NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ("user_id", "role_id"),
  CONSTRAINT "FK_UserRole_UserLoginData" FOREIGN KEY ("user_id") REFERENCES "auth"."UserLoginData" ("user_id"),
  CONSTRAINT "FK_UserRole_Role" FOREIGN KEY ("role_id") REFERENCES "auth"."Role" ("id")
);
