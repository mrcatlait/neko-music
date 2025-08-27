CREATE TABLE "auth"."UserAccount" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "emailAddress" VARCHAR(255) NOT NULL UNIQUE,
  "roleId" UUID NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT "FK_UserAccount_Role" FOREIGN KEY ("roleId") REFERENCES "auth"."Role" ("id")
);

COMMENT ON TABLE "auth"."UserAccount" IS 'A user account';
COMMENT ON COLUMN "auth"."UserAccount"."id" IS 'The id of the user';
COMMENT ON COLUMN "auth"."UserAccount"."emailAddress" IS 'The email address of the user';
COMMENT ON COLUMN "auth"."UserAccount"."roleId" IS 'The role of the user';
COMMENT ON COLUMN "auth"."UserAccount"."verified" IS 'Whether the user is verified';
