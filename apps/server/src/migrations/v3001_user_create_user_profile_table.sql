CREATE TABLE "user"."UserProfile" (
  "userId" UUID PRIMARY KEY,
  "displayName" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_UserProfile_UserAccount" FOREIGN KEY ("userId") REFERENCES "auth"."UserAccount" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "user"."UserProfile" IS 'A user profile';
COMMENT ON COLUMN "user"."UserProfile"."userId" IS 'Foreign key to the user';
COMMENT ON COLUMN "user"."UserProfile"."displayName" IS 'The display name of the user';
