CREATE TABLE "auth"."ExternalProvider" (
  "userId" UUID PRIMARY KEY,
  "provider" VARCHAR(255) NOT NULL,
  "providerUserId" VARCHAR(255) NOT NULL,
  CONSTRAINT "FK_ExternalProvider_Account" FOREIGN KEY ("userId") REFERENCES "auth"."Account" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_ExternalProvider_ProviderUserId" UNIQUE ("provider", "providerUserId")
);

COMMENT ON TABLE "auth"."ExternalProvider" IS 'A user external provider';
COMMENT ON COLUMN "auth"."ExternalProvider"."userId" IS 'Foreign key to the user';
COMMENT ON COLUMN "auth"."ExternalProvider"."provider" IS 'The provider of the user';
COMMENT ON COLUMN "auth"."ExternalProvider"."providerUserId" IS 'The id of the user in the external provider';
