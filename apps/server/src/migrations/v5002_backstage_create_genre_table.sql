CREATE TABLE "backstage"."Genre" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" VARCHAR(255) NOT NULL UNIQUE,
  "slug" VARCHAR(255) NOT NULL UNIQUE,
  "status" "backstage"."PublishingStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdBy" UUID NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedBy" UUID NOT NULL
);

COMMENT ON TABLE "backstage"."Genre" IS 'A genre of music';

COMMENT ON COLUMN "backstage"."Genre"."name" IS 'The name of the genre';
COMMENT ON COLUMN "backstage"."Genre"."slug" IS 'The slug of the genre';
COMMENT ON COLUMN "backstage"."Genre"."status" IS 'The status of the publishing process';
COMMENT ON COLUMN "backstage"."Genre"."createdAt" IS 'The timestamp of the genre creation';
COMMENT ON COLUMN "backstage"."Genre"."createdBy" IS 'The user who created the genre';
COMMENT ON COLUMN "backstage"."Genre"."updatedAt" IS 'The timestamp of the genre update';
COMMENT ON COLUMN "backstage"."Genre"."updatedBy" IS 'The user who updated the genre';
