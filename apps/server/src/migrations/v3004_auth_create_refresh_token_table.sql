CREATE TABLE "auth"."RefreshToken" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "token" VARCHAR(255) NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  CONSTRAINT "FK_RefreshToken_Account" FOREIGN KEY ("userId") REFERENCES "auth"."Account" ("id") ON DELETE CASCADE,
  CONSTRAINT "UQ_RefreshToken_Token" UNIQUE ("token")
);

COMMENT ON TABLE "auth"."RefreshToken" IS 'A refresh token';
COMMENT ON COLUMN "auth"."RefreshToken"."userId" IS 'Foreign key to the user';
COMMENT ON COLUMN "auth"."RefreshToken"."token" IS 'The token';
COMMENT ON COLUMN "auth"."RefreshToken"."expiresAt" IS 'The expiration date';
