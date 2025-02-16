CREATE TABLE "UserRole" (
  "user_id" UUID NOT NULL,
  "role_id" UUID NOT NULL,
  PRIMARY KEY ("user_id", "role_id"),
  CONSTRAINT "FK_UserRole_UserAccount" FOREIGN KEY ("user_id") REFERENCES "UserAccount" ("user_id"),
  CONSTRAINT "FK_UserRole_Role" FOREIGN KEY ("role_id") REFERENCES "Role" ("id")
);
