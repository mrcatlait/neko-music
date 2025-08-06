CREATE TABLE "user"."UserPreferences" (
  "userId" UUID PRIMARY KEY,
  "emailPreferences" JSONB NOT NULL DEFAULT '{
    "marketing": false,
    "newReleases": false,
    "securityAlerts": false,
    "weeklyDigest": false
  }',
  "pushPreferences" JSONB NOT NULL DEFAULT '{
    "marketing": false,
    "newReleases": false
  }',
  CONSTRAINT "FK_UserPreferences_UserAccount" FOREIGN KEY ("userId") REFERENCES "auth"."UserAccount" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "user"."UserPreferences" IS 'A user preferences';
COMMENT ON COLUMN "user"."UserPreferences"."userId" IS 'Foreign key to the user';
COMMENT ON COLUMN "user"."UserPreferences"."emailPreferences" IS 'The email preferences of the user';
COMMENT ON COLUMN "user"."UserPreferences"."pushPreferences" IS 'The push preferences of the user';
