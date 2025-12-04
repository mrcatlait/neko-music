CREATE TABLE "auth"."Account" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "emailAddress" VARCHAR(255) NOT NULL UNIQUE,
  "roleId" UUID NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT "FK_Account_Role" FOREIGN KEY ("roleId") REFERENCES "auth"."Role" ("id")
);

COMMENT ON TABLE "auth"."Account" IS 'A user account';
COMMENT ON COLUMN "auth"."Account"."id" IS 'The id of the user';
COMMENT ON COLUMN "auth"."Account"."emailAddress" IS 'The email address of the user';
COMMENT ON COLUMN "auth"."Account"."roleId" IS 'The role of the user';
COMMENT ON COLUMN "auth"."Account"."verified" IS 'Whether the user is verified';
