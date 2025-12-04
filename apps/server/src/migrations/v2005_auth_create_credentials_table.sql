CREATE TABLE "auth"."Credentials" (
  "userId" UUID PRIMARY KEY,
  "passwordHash" VARCHAR(255) NOT NULL,
  "passwordSalt" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_Credentials_Account" FOREIGN KEY ("userId") REFERENCES "auth"."Account" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "auth"."Credentials" IS 'A user credentials';
COMMENT ON COLUMN "auth"."Credentials"."userId" IS 'Foreign key to the user';
COMMENT ON COLUMN "auth"."Credentials"."passwordHash" IS 'The password hash of the user';
COMMENT ON COLUMN "auth"."Credentials"."passwordSalt" IS 'The password salt of the user';