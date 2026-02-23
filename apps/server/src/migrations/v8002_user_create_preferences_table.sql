CREATE TABLE "user"."Preferences" (
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
  CONSTRAINT "FK_Preferences_Account" FOREIGN KEY ("userId") REFERENCES "auth"."Account" ("id") ON DELETE CASCADE
);

COMMENT ON TABLE "user"."Preferences" IS 'A user preferences';
COMMENT ON COLUMN "user"."Preferences"."userId" IS 'Foreign key to the user';
COMMENT ON COLUMN "user"."Preferences"."emailPreferences" IS 'The email preferences of the user';
COMMENT ON COLUMN "user"."Preferences"."pushPreferences" IS 'The push preferences of the user';
