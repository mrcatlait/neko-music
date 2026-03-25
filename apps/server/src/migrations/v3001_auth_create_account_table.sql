CREATE TABLE "auth"."Account" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "emailAddress" VARCHAR(255) NOT NULL UNIQUE,
  "role" VARCHAR(255) NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT FALSE
);

COMMENT ON TABLE "auth"."Account" IS 'A user account';
COMMENT ON COLUMN "auth"."Account"."id" IS 'The id of the user';
COMMENT ON COLUMN "auth"."Account"."emailAddress" IS 'The email address of the user';
COMMENT ON COLUMN "auth"."Account"."role" IS 'The name of the role of the user';
COMMENT ON COLUMN "auth"."Account"."verified" IS 'Whether the user is verified';
