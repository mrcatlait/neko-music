CREATE TABLE "user"."Profile" (
  "userId" UUID PRIMARY KEY,
  "displayName" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_Profile_Account" FOREIGN KEY ("userId") REFERENCES "auth"."Account" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "user"."Profile" IS 'A user profile';
COMMENT ON COLUMN "user"."Profile"."userId" IS 'Foreign key to the user';
COMMENT ON COLUMN "user"."Profile"."displayName" IS 'The display name of the user';
