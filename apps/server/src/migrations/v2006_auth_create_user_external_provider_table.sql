CREATE TABLE "auth"."UserExternalProvider" (
  "userId" UUID PRIMARY KEY,
  "provider" VARCHAR(255) NOT NULL,
  "providerUserId" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_UserExternal_UserAccount" FOREIGN KEY ("userId") REFERENCES "auth"."UserAccount" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_UserExternal_ProviderUserId" UNIQUE ("provider", "providerUserId")
);

COMMENT ON TABLE "auth"."UserExternalProvider" IS 'A user external provider';
COMMENT ON COLUMN "auth"."UserExternalProvider"."userId" IS 'Foreign key to the user';
COMMENT ON COLUMN "auth"."UserExternalProvider"."provider" IS 'The provider of the user';
COMMENT ON COLUMN "auth"."UserExternalProvider"."providerUserId" IS 'The id of the user in the external provider';
