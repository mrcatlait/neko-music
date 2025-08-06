CREATE TABLE "auth"."UserCredentials" (
  "userId" UUID PRIMARY KEY,
  "passwordHash" VARCHAR(255) NOT NULL,
  "passwordSalt" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_UserCredentials_UserAccount" FOREIGN KEY ("userId") REFERENCES "auth"."UserAccount" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "auth"."UserCredentials" IS 'A user credentials';
COMMENT ON COLUMN "auth"."UserCredentials"."userId" IS 'Foreign key to the user';
COMMENT ON COLUMN "auth"."UserCredentials"."passwordHash" IS 'The password hash of the user';
COMMENT ON COLUMN "auth"."UserCredentials"."passwordSalt" IS 'The password salt of the user';